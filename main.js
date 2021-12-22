'use strict';
//import datetime & grab date in yyyy-mm-dd (add one day) -- if you want to customize the date look here for help: https://moment.github.io/luxon/#/tour?id=math
const { DateTime } = require('luxon');
const dateStr = DateTime.now().plus({ days: 14 }).toISODate();

//import modules
const { scraper } = require('./javascript modules/scraper');
const { airCodes } = require('./javascript modules/data');

//Create URLs
(async function () {
  for (const el of airCodes) {
    for (let i = 0; i <= airCodes.length - 1; i++) {
      if (el === airCodes[i]) {
        continue;
      } else {
        let url = `https://www.southwest.com/air/booking/select.html?int=HOMEQBOMAIR&adultPassengersCount=1&departureDate=${dateStr}&destinationAirportCode=${airCodes[i]}&fareType=USD&originationAirportCode=${el}&passengerType=ADULT&returnDate=&tripType=oneway&departureTimeOfDay=ALL_DAY&reset=true&returnTimeOfDay=ALL_DAY`;
        await scraper(el, airCodes[i], dateStr, url);
      }
    }
  }
})();
