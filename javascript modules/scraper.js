'use strict';

//require library
const puppeteer = require('puppeteer');

//import processing functions
const {processFlightNums} = require('./processing');


//Create class -- this is the one that gets returned to main.js
class Allflights {
  constructor(departurePort, arrivalPort, flight1, flight2, flight3, flight4, flight5, flight6){
    this.departurePort = departurePort; //String of departure airport code
    this.arrivalPort = arrivalPort; //String of arrival airport code
    this.flight1 = flight1; //an object containing the class below
    this.flight2 = flight2;
    this.flight3 = flight3;
    this.flight4 = flight4;
    this.flight5 = flight5;
    this.flight6 = flight6;
  }
};

//Create Metadata class 
class Flight{
  constructor(stops, planeChange, flightNums, deptTime, arrTime, duration, prices, seatsLeft){
    this.stops = stops; //number of stops or 'Nonstop' string
    this.planeChange = planeChange; // array with either a -1 or a 1 and an airport code. [-1] || [1, 'DAL']
    this.flightNums = flightNums; //array of flight numbers
    this.deptTime = deptTime; //string formated like '5:42pm' according to 12-hr clock. 
    this.arrTime = arrTime; //string formated like deptTime
    this.duration = duration; //String formatted like this: '8h 35m'
    this.prices = prices //an array of prices -- formatted like this: [business, anytime[economyplus], wanna-get-away[economy]] where most expensive ticket is first.
    this.seatsLeft = seatsLeft; //number of seats left or -1
  }
};

async function pageScrape(dept, arr, url) {
  //initilize class variables
  let departurePort = dept, arrivalPort = arr, stops, planeChange, flightNums, deptTime, arrTime, duration, prices, seatsLife;

  const browser = await puppeteer.launch({headless: false, defaultViewport: {width: 988, height: 977}});
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

  //Scrape Flight data for row
  for(let i = 1; i <= 6; i++){
    //Flight Nums
    await page.waitForXPath(`//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[1]/div/div/button/span[1]`);
    const flightNumElement = await page.$x(`//*[@id="air-booking-product-0"]/div[6]/span/span/ul/li[${i}]/div[1]/div/div/button/span[1]`);
    const flightNumStr = await page.evaluate(el => el.textContent, flightNumElement[0]);
    //Store final flightNums value
    flightNums = processFlightNums(flightNumStr);

    //All row values
    console.log(flightNums);
  }

  //browser.close();
}


//export module source: https://youtu.be/nt9M-rlbWc8
module.exports = {
  scraper: pageScrape,
}