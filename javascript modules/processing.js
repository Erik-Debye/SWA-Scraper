'use strict';

//Processing Flight Numbers
//sample inputs '# 4444' || '# 4444 / 2222'
const processFlightNums = (str) =>{
     let flightNums = str.split(' ').slice(1);
     const index = flightNums.indexOf('/');
     if (index > -1) flightNums.splice(index, 1);

    return flightNums;
}


module.exports = {
    processFlightNums: processFlightNums,
}