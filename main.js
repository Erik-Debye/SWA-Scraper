'use strict';

//import datetime & grab date in yyyy-mm-dd (add one month + one day) -- if you want to customize the date look here for help: https://moment.github.io/luxon/#/tour?id=math
const { DateTime } = require('luxon');

//import modules
const { scraper } = require('./javascript modules/scraper');
const { airCodes } = require('./javascript modules/data');
const { months, days } = require('./javascript modules/config');

//Create Date String
const dateStr = DateTime.now().plus({ months: months }).plus({ days: days }).toISODate();

//Create URLs
(async function () {
  for (const el of airCodes) {
    for (let i = 0; i <= airCodes.length - 1; i++) {
      if (el === airCodes[i]) {
        continue;
      } else {
        let url = `https://www.southwest.com/air/booking/select.html?int=HOMEQBOMAIR&adultPassengersCount=1&departureDate=${dateStr}&destinationAirportCode=${airCodes[i]}&fareType=USD&originationAirportCode=${el}&passengerType=ADULT&returnDate=&tripType=oneway&departureTimeOfDay=ALL_DAY&reset=true&returnTimeOfDay=ALL_DAY`;
        let flightData = await scraper(el, airCodes[i], dateStr, url);
        if (flightData) {
          console.log(`Success : ${el} -> ${airCodes[i]} @ ${dateStr}`);
        } else {
          console.log(`Error : ${el} -> ${airCodes[i]} @ ${dateStr}`);
        }
      }
    }
  }
})();
