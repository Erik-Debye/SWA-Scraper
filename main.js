'use strict';

//import scraper
const {scraper} = require('./scraper');

//URL Scheme =>  https://www.southwest.com/air/booking/select.html?int=HOMEQBOMAIR&adultPassengersCount=1&departureDate=2021-12-14&destinationAirportCode=BWI&fareType=USD&originationAirportCode=ORD&passengerType=ADULT&returnDate=&tripType=oneway&departureTimeOfDay=ALL_DAY&reset=true&returnTimeOfDay=ALL_DAY

//Inserts Date
const date = new Date();
const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay() + 1}`;

//Every IATA airport code SW flies to as of Dec 2021 source: https://mobile.southwest.com/where-we-fly
const airCodes = [
  'ALB','ABQ','AMA','AUA','ATL','AUS','BWI','BZE','BLI','BHM','BOI','BOS','BZN','BUF','BUR','CUN','CHS','CLT','MDW','ORD','CVG','CLE','COS','CMH','CRP','CZM','DAL','DEN','DSM','VPS','DTW','ELP','EUG','FLL','RSW','FAT','GCM','GRR','GSP','HRL','BDL','HAV','ITO','HNL','IAH','HOU','IND','JAN','JAX','OGG','MCI','KOA','LAS','LIR','KIH','LIT','LGB','ISP','LAX','SJD','SDF','LBB','MHT','MEM','MIA','MAF','MKE','MSP','MBJ','MTJ','MYR','BNA','NAS','MSY','LGA','ORF','OAK','OKC','OMA','ONT','SNA','MCO','PSP','ECP','PNS','PHL','PHX','PIT','PDX','PWM','PVD','PLS','PVR','PUJ','RDU','RNO','RIC','ROC','SMF','SLC','SAT','SAN','SFO','SJC','SJO','SJU','SBA','SRQ','SAV','SEA','GEG','STL','HDN','SYR','TPA','TUS','TUL','IAD','DCA','PBI','ICT',
];

  /*Create URL
  const urlScheme = `https://www.southwest.com/air/booking/select.html?int=HOMEQBOMAIR&adultPassengersCount=1&departureDate=${date}&destinationAirportCode=${arr}&fareType=USD&originationAirportCode=${dep}&passengerType=ADULT&returnDate=&tripType=oneway&departureTimeOfDay=ALL_DAY&reset=true&returnTimeOfDay=ALL_DAY`;

  //test url
  let testURL = `https://www.southwest.com/air/booking/select.html?adultPassengersCount=1&departureDate=2021-12-14&departureTimeOfDay=ALL_DAY&destinationAirportCode=IAD&fareType=USD&int=HOMEQBOMAIR&originationAirportCode=HOU&passengerType=ADULT&reset=true&returnDate=&returnTimeOfDay=ALL_DAY&tripType=oneway`
*/

//Map through array 

//call scraper.js for each instance
//create object -> json -> save in new file || Automatically submit object to supabase

