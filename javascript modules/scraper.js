'use strict';

//require puppeteer and initialize
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

//import processing functions
const { processFlightNums, processNumStops, processSeatsLeft, processPlaneChange } = require('./processing');

//import API configuration values
const { supabaseURL, publicAPIKey } = require('./config');

//import supabase and point to table
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseURL, publicAPIKey);

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

//Grabs text from a given element
const txtGrab = (element) => {
  page.evaluate((el) => el.textContent, element[0]);
};

async function pageScrape(dept, arr, dateStr, url) {
  //initilize variables
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
    seatsLeft = [],
    metadata,
    flight;

  puppeteerExtra.use(pluginStealth());
  const browser = await puppeteerExtra.launch({
    executablepath: 'C:\\Program Files\\Google\\Chrome Dev\\Application\\chrome.exe',
    userDataDir: 'C:\\Users\\erikd\\AppData\\Local\\Google\\Chrome Dev\\User Data',
    headless: true,
    args: ['--start-maximized'],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  if (page.url() != url) {
    //Press search button
    const search = await page.waitForXPath('//*[@id="form-mixin--submit-button"]');
    await search.click();
    await page.waitForTimeout(8525);
  }

  await page.evaluate((_) => {
    window.scrollBy(0, 250);
  });

  await page.waitForTimeout(1245);
  //Counting # of rows
  const count = await page.$$eval('.air-booking-select-detail', (rows) => rows.length);

  if (count === 0) {
    return false;
  } else {
    //Scrape Flight data for row
    for (let i = 1; i <= count; i++) {
      //Flight Nums
      const flightNumElement = await page.$x(
        `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[1]/div/div/button/span[1]`
      );
      const flightNumStr = await txtGrab(flightNumElement);
      flightNums = processFlightNums(flightNumStr);

      //numstops
      const numStopsElement = await page.$x(
        `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[4]/div/button/span[1]/div`
      );
      if (numStopsElement.length > 0) {
        const numStopsStr = await txtGrab(numStopsElement);
        numStops = processNumStops(numStopsStr);
      } else {
        numStops = 'Nonstop';
      }

      //Change Planes
      const planeChangeElement = await page.$x(
        `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[4]/div[2]`
      );
      if (planeChangeElement.length > 0) {
        const planeChangeStr = await txtGrab(planeChangeElement);
        planeChange = processPlaneChange(planeChangeStr);
      } else {
        planeChange = null;
      }

      //depttime
      const deptTimeElement = await page.$x(
        `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[2]/span/text()`
      );
      const deptTimeStr = await txtGrab(deptTimeElement);
      const deptTimeAmPm = await page.$x(
        `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[2]/span/span[2]`
      );
      const deptTimeAmPmStr = await txtGrab(deptTimeAmPm);
      deptTime = `${deptTimeStr} ${deptTimeAmPmStr}`;

      //arrTime
      const arrTimeElement = await page.$x(
        `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[3]/span/text()`
      );
      const arrTimeStr = await txtGrab(arrTimeElement);
      const arrTimeAmPm = await page.$x(
        `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[3]/span/span[2]`
      );
      const arrTimeAmPmStr = await txtGrab(arrTimeAmPm);
      arrTime = `${arrTimeStr} ${arrTimeAmPmStr}`;

      //duration
      const durationElement = await page.$x(`//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[5]`);
      duration = await txtGrab(durationElement);

      //prices
      for (let j = 1; j <= 3; j++) {
        const priceElement = await page.$x(
          `//*[@id="air-booking-fares-0-${i}"]/div[${j}]/button/span/span/span/span/span[2]/span[2]`
        );
        if (priceElement.length > 0) {
          const price = await txtGrab(priceElement);
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
          const seatsLeftStr = await txtGrab(seatsLeftElement);
          seatsLeft.push(processSeatsLeft(seatsLeftStr));
        } else {
          seatsLeft.push(null);
        }
      }

      //Create objects
      metadata = new MetadataObj(flightNums, numStops, planeChange, deptTime, arrTime, duration, prices, seatsLeft);
      flight = new FlightObj(departurePort, arrivalPort, date, metadata);

      //upload to supabase, print error if it breaks
      const { error } = await supabase.from('Flights').insert([flight]);
      if (error) console.log(error);

      //Reset Arrays
      prices.length = 0;
      seatsLeft.length = 0;
    }

    await page.waitForTimeout(31542);
  }
  browser.close();
  return flight;
}

//export scraper to main.js
module.exports = {
  scraper: pageScrape,
};
