//Currently need to come up with a good convention for no data values. Either null, or '', or -1. Needs to happen at no flights + no change planes.

'use strict';
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

//import processing functions
const { processFlightNums, processNumStops, processSeatsLeft, processPlaneChange } = require('./processing');

//Create class -- this is the one that will be pushed into supabase as jsonb
class FlightObj {
  constructor(departurePort, arrivalPort, date, metadata) {
    this.departurePort = departurePort; //String of departure airport code
    this.arrivalPort = arrivalPort; //String of arrival airport code
    this.date = date;
    this.metadata = metadata;
  }
}

//Create Metadata class
class MetadataObj {
  constructor(flightNums, numStops, planeChange, deptTime, arrTime, duration, prices, seatsLeft) {
    this.flightNums = flightNums; //array of flight numbers
    this.numStops = numStops; //number of stops or 'Nonstop' string
    this.planeChange = planeChange; // array with either a -1 or a 1 and an airport code. [-1] || [1, 'DAL']
    this.deptTime = deptTime; //string formated like '5:42pm' according to 12-hr clock.
    this.arrTime = arrTime; //string formated like deptTime
    this.duration = duration; //String formatted like this: '8h 35m'
    this.prices = prices; //an array of prices -- formatted like this: [business, anytime[economyplus], wanna-get-away[economy]] where most expensive ticket is first.
    this.seatsLeft = seatsLeft; //number of seats left or -1
  }
}

async function pageScrape(dept, arr, dateStr, url) {
  //initilize class variables
  let departurePort = dept,
    arrivalPort = arr,
    date = dateStr,
    numStops,
    planeChange,
    flightNums,
    deptTime,
    arrTime,
    duration,
    prices = [],
    seatsLeft = [];

  puppeteerExtra.use(pluginStealth());
  const browser = await puppeteerExtra.launch({ headless: false, args: ['--start-maximized'] });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  //Human Bahavior - Timeout for 2 secs
  await page.waitForTimeout(2000);

  //Human Bahavior - Timeout for 2.5 secs
  await page.waitForTimeout(2500);

  //Counting # of rows
  const count = await page.$$eval('.air-booking-select-detail', (rows) => rows.length);

  if (count === 0) {
    let metadata = new MetadataObj(null, null, null, null, null, null, [null, null, null], [null, null, null]);
    let flight = new FlightObj(departurePort, arrivalPort, date, metadata);
    console.log(flight);
  } else {
    //Scrape Flight data for row
    for (let i = 1; i <= count; i++) {
      //Flight Nums
      const flightNumElement = await page.$x(
        `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[1]/div/div/button/span[1]`
      );
      const flightNumStr = await page.evaluate((el) => el.textContent, flightNumElement[0]);
      flightNums = processFlightNums(flightNumStr);

      //numstops
      const numStopsElement =
        (await page.$x(
          `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[4]/div/button/span[1]/div`
        )) || null;
      if (numStopsElement) {
        const numStopsStr = await page.evaluate((el) => el.textContent, numStopsElement[0]);
        numStops = processNumStops(numStopsStr);
      } else {
        numStops = 'Nonstop';
      }

      //Change Planes
      const planeChangeElement =
        (await page.$x(`//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[4]/div[2]`)) || null;
      if (planeChangeElement) {
        const planeChangeStr = await page.evaluate((el) => el.textContent, planeChangeElement[0]);
        planeChange = processPlaneChange(planeChangeStr);
      } else {
        planeChange = null;
      }

      //depttime
      const deptTimeElement = await page.$x(
        `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[2]/span/text()`
      );
      const deptTimeStr = await page.evaluate((el) => el.textContent, deptTimeElement[0]);
      const deptTimeAmPm = await page.$x(
        `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[2]/span/span[2]`
      );
      const deptTimeAmPmStr = await page.evaluate((el) => el.textContent, deptTimeAmPm[0]);
      deptTime = `${deptTimeStr} ${deptTimeAmPmStr}`;

      //arrTime
      const arrTimeElement = await page.$x(
        `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[3]/span/text()`
      );
      const arrTimeStr = await page.evaluate((el) => el.textContent, arrTimeElement[0]);
      const arrTimeAmPm = await page.$x(
        `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[3]/span/span[2]`
      );
      const arrTimeAmPmStr = await page.evaluate((el) => el.textContent, arrTimeAmPm[0]);
      arrTime = `${arrTimeStr} ${arrTimeAmPmStr}`;

      //duration
      const durationElement = await page.$x(`//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[5]`);
      duration = await page.evaluate((el) => el.textContent, durationElement[0]);

      //prices

      for (let j = 1; j <= 3; j++) {
        const priceElement = await page.$x(
          `//*[@id="air-booking-fares-0-${i}"]/div[${j}]/button/span/span/span/span/span[2]/span[2]`
        );
        if (priceElement.length > 0) {
          const price = await page.evaluate((el) => el.textContent, priceElement[0]);
          prices.push(price);
        } else {
          prices.push(null);
        }
      }

      //Seats left
      for (let j = 1; j <= 3; j++) {
        const seatsLeftElement = await page.$x(
          `//*[@id="air-booking-fares-0-${i}"]/div[${j}]/button/span/span/span/div/span`
        );
        if (seatsLeftElement.length > 0) {
          const seatsLeftStr = await page.evaluate((el) => el.textContent, seatsLeftElement[0]);
          seatsLeft.push(processSeatsLeft(seatsLeftStr));
        } else {
          seatsLeft.push(null);
        }
      }

      let metadata = new MetadataObj(flightNums, numStops, planeChange, deptTime, arrTime, duration, prices, seatsLeft);
      let flight = new FlightObj(departurePort, arrivalPort, date, metadata);
      console.log(flight);

      //Reset Arrays
      prices.length = 0;
      seatsLeft.length = 0;
    }
  }
  browser.close();
}

//export module source: https://youtu.be/nt9M-rlbWc8
module.exports = {
  scraper: pageScrape,
};
