//Every IATA airport code SW flies to as of Dec 2021 source: https://mobile.southwest.com/where-we-fly
const airCodes = [
    'ALB','ABQ','AMA','AUA','ATL','AUS','BWI','BZE','BLI','BHM','BOI','BOS','BZN','BUF','BUR','CUN','CHS','CLT','MDW','ORD','CVG','CLE','COS','CMH','CRP','CZM','DAL','DEN','DSM','VPS','DTW','ELP','EUG','FLL','RSW','FAT','GCM','GRR','GSP','HRL','BDL','HAV','ITO','HNL','IAH','HOU','IND','JAN','JAX','OGG','MCI','KOA','LAS','LIR','KIH','LIT','LGB','ISP','LAX','SJD','SDF','LBB','MHT','MEM','MIA','MAF','MKE','MSP','MBJ','MTJ','MYR','BNA','NAS','MSY','LGA','ORF','OAK','OKC','OMA','ONT','SNA','MCO','PSP','ECP','PNS','PHL','PHX','PIT','PDX','PWM','PVD','PLS','PVR','PUJ','RDU','RNO','RIC','ROC','SMF','SLC','SAT','SAN','SFO','SJC','SJO','SJU','SBA','SRQ','SAV','SEA','GEG','STL','HDN','SYR','TPA','TUS','TUL','IAD','DCA','PBI','ICT'
];

/*
Typical URL =>  https://www.southwest.com/air/booking/index.html?int=HOMEQBOMAIR&adultPassengersCount=1&departureDate=2021-12-14&destinationAirportCode=BWI&fareType=USD&originationAirportCode=ORD&passengerType=ADULT&returnDate=&tripType=oneway&departureTimeOfDay=ALL_DAY&reset=true&returnTimeOfDay=ALL_DAY

*/

module.exports = {
    airCodes: airCodes
  };