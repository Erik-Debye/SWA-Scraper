'use strict';
//import datetime & grab date in yyyy-mm-dd
const {DateTime} = require('luxon');
let [...dateStr] = DateTime.now().toISODate();
dateStr[9] = String(Number(dateStr[9]) + 1);
dateStr = dateStr.join('');

//const {scraper} = require('./scraper');
const {airCodes} = require('./data');


console.log(dateStr);
//Create URL
//const urlScheme = `https://www.southwest.com/air/booking/select.html?int=HOMEQBOMAIR&adultPassengersCount=1&departureDate=${date}&destinationAirportCode=${arr}&fareType=USD&originationAirportCode=${dep}&passengerType=ADULT&returnDate=&tripType=oneway&departureTimeOfDay=ALL_DAY&reset=true&returnTimeOfDay=ALL_DAY`;


