'use strict';
const puppeteer = require('puppeteer');

//import processing functions
const { processFlightNums } = require('./processing');

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
  constructor(stops, planeChange, flightNums, deptTime, arrTime, duration, prices, seatsLeft) {
    this.stops = stops; //number of stops or 'Nonstop' string
    this.planeChange = planeChange; // array with either a -1 or a 1 and an airport code. [-1] || [1, 'DAL']
    this.flightNums = flightNums; //array of flight numbers
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
    stops,
    planeChange,
    flightNums,
    deptTime,
    arrTime,
    duration,
    prices,
    seatsLife;

  const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'] });
  const page = await browser.newPage();
  await page.goto(url);
  //Human Bahavior - Timeout for 2 secs
  await page.waitForTimeout(2000);

  //Press search button
  const search = await page.waitForXPath('//*[@id="form-mixin--submit-button"]');
  await search.click();

  //Human Bahavior - Timeout for 2.5 secs
  await page.waitForTimeout(2500);

  console.log(departurePort);
  console.log(arrivalPort);
  console.log(date);

  await page.waitForXPath('//*[@id="air-booking-product-0"]/div[6]/span/span/ul');
  const rows = await page.$x('//*[@id="air-booking-product-0"]/div[6]/span/span/ul');

  //Scrape Flight data for row
  for (let k = 1; k <= rows.length / 2 && rows.length / 2 > 0; k++) {
    
    //Flight Nums
    await page.waitForXPath(
      `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[1]/div/div/button/span[1]`
    );
    const flightNumElement = await page.$x(
      `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[1]/div/div/button/span[1]`
    );
    const flightNumStr = await page.evaluate((el) => el.textContent, flightNumElement[0]);
    //Store final flightNums value
    flightNums = processFlightNums(flightNumStr);
   
    console.log(flightNums);
    
    //depttime
    await page.waitForXPath(`//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[2]/span/text()`);
    const deptTimeElement = await page.$x(
      `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[2]/span/text()`
    );
    const deptTimeStr = await page.evaluate((el) => el.textContent, deptTimeElement[0]);
    const deptTimeAmPm = await page.$x(
      `//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[2]/span/span[2]`
    );
    const deptTimeAmPmStr = await page.evaluate((el) => el.textContent, deptTimeAmPm[0]);
    //Store Final value
    deptTime = `${deptTimeStr} ${deptTimeAmPmStr}`;
    console.log(deptTime);
  }
  //browser.close();
}











//export module source: https://youtu.be/nt9M-rlbWc8
module.exports = {
  scraper: pageScrape,
};
