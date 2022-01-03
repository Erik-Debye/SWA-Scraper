'use strict';

//Processing Flight Numbers
//sample inputs '# 4444' || '# 4444 / 2222'
const processFlightNums = (str) => {
  let flightNums = str.split(' ').slice(1);
  const index = flightNums.indexOf('/');
  if (index > -1) flightNums.splice(index, 1);

  return flightNums;
};

//example input = '1 stop'
const processNumStops = (str) => {
  let numStopsArr = str.split(' ');
  let numStops = numStopsArr[0];
  return numStops;
};

//example input = '5 left'
const processSeatsLeft = (str) => {
  let seatsLeftArr = str.split(' ');
  let seats = seatsLeftArr[0];
  return seats;
};

//example input = 'Change Planes BWI'
const processPlaneChange = (str) => {
  let planeChangeArr = str.split(' ');
  let planeChange = planeChangeArr[2];
  return planeChange;
};

module.exports = {
  processFlightNums: processFlightNums,
  processNumStops: processNumStops,
  processSeatsLeft: processSeatsLeft,
  processPlaneChange: processPlaneChange,
};
