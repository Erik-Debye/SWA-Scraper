const puppeteer = require('puppeteer');

async function scrapePrices(url) {
    //Launch Browser
    const browser = await puppeteer.launch();
    //Open new page/tab
    const page = await puppeteer.newPage();


}