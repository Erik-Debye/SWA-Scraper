# Southwest-Scraper

This is a scraper for Southwest Airlines Ticket Prices. It saves the scraped data into your private Supabase database (https://supabase.com/) for storage and use. It requires 3 dependancies - Puppeteer (to scrape the webpage), Luxon (small date package), and Supabase-JS (to load data into your database).

As of now, this is an unfinished project. Scraping capabilities are currently under development (but going well).

The goal is to scrape the first six rows of future (2 weeks out) flights data between each Southwest Airport (as of Dec. 2021). The data will include the following, formatted like so:


    departurePort: 'ATL',

    arrivalPort: 'BWI',

    flight1: {
        numStops: '1',
        changePlanes: [-1],
        flightNums: ['5263', '4519'],
        deptTime: '4:30am',
        arrTime: '7:05am',
        duration: '2h 35m',
        prices: ['364', 'Unavailable', '340'],
        seatsleft: [-1, -1, -1],
    },
    flight2: {
        numStops: '2',
        changePlanes: [1, 'IAD'],
        flightNums: ['6778', '4543'],
        deptTime: '3:30am',
        arrTime: '7:05am',
        duration: '3h 35m',
        prices: ['322', '304', '297'],
        seatsleft: [-1, 4, 4],
    },
    flight3: {
        numStops: 'Nonstop',
        changePlanes: [-1],
        flightNums: ['7423'],
        deptTime: '6:25am',
        arrTime: '7:45am',
        duration: '1h 20m',
        prices: ['398', '388', 'Unavailable'],
        seatsleft: [-1, -1, -1],
    },
    flight4: {
        numStops: '1',
        changePlanes: [-1],
        flightNums: ['8894', '2564'],
        deptTime: '11:35am',
        arrTime: '2:25pm',
        duration: '2h 50m',
        prices: ['448', '350', '246'],
        seatsleft: [-1, 3, 2],
    },
    flight5: {
        numStops: 'Nonstop',
        changePlanes: [-1],
        flightNums: ['1184'],
        deptTime: '3:45pm',
        arrTime: '6:05pm',
        duration: '2h 20m',
        prices: ['Unavailable', 'Unavailable', 'Unavailable'],
        seatsleft: [-1, -1, -1],
    },
    flight6: {
        numStops: '2',
        changePlanes: [1, 'IAD'],
        flightNums: ['5589', '3387'],
        deptTime: '9:05pm',
        arrTime: '11:05pm',
        duration: '2h 0m',
        prices: ['301', '223', '174'],
        seatsleft: [2 , -1, 4],
    },


Notes: 

>numStops will consist of either a number (as a String) of stops OR the string 'Nonstop'.

>changePlanes will consist of an array with a -1 if there is no plane change OR an array with a 1 and an airport code i.e. [1, 'DAL'].

>flightNums will only consist of Numeric values as South West does not currently use ALpha-Numeric Flight Numbers.

>The prices array will mimic the structure of the webpage, reading left to right. The price catagories are as follows: [Business Select, Anytime, Wanna Get Away]. The string 'Unavailable' will indicate when tickets for that seat were sold out.

>seatsLeft will either consist of a positive number which will indicate the number of seats left for that category of ticket or a -1. It is important to understand that -1 does not mean all seats were taken, but rather that there are many seats OR no seats. It's order is the same as the prices array (reading page left to right). Do NOT use seatsLeft to determine if seats exist (use the prices property). 

 
The goal for this project is to pass all this data into your Supabase database. To do so, you must create an account there and create a table with the specified properties. Then add your anon restful API key into the project and hopefully it should then push data into the database as it creates it. This is still a theoretical feature that hasn't been fully fleshed out. But hey that's the currrent line of thought. 