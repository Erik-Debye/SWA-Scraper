'use strict';
//import datetime & grab date in yyyy-mm-dd (add one day) -- if you want to customize the date look here for help: https://moment.github.io/luxon/#/tour?id=math
const {DateTime} = require('luxon');
const dateStr = DateTime.now().plus({days : 14}).toISODate();

//import modules
const {scraper} = require('./scraper');
const {airCodes} = require('./data');


//Create URL
//const urlScheme = `https://www.southwest.com/air/booking/select.html?int=HOMEQBOMAIR&adultPassengersCount=1&departureDate=${date}&destinationAirportCode=${arr}&fareType=USD&originationAirportCode=${dep}&passengerType=ADULT&returnDate=&tripType=oneway&departureTimeOfDay=ALL_DAY&reset=true&returnTimeOfDay=ALL_DAY`;

//test url
const testURL = `https://www.southwest.com/air/booking/select.html?adultPassengersCount=1&departureDate=2021-12-16&departureTimeOfDay=ALL_DAY&destinationAirportCode=IAD&fareType=USD&int=HOMEQBOMAIR&originationAirportCode=HOU&passengerType=ADULT&reset=true&returnDate=&returnTimeOfDay=ALL_DAY&tripType=oneway`

scraper(testURL);
