'use strict';

//require library
const puppeteer = require('puppeteer');

//main controller
async function pageScrap(arr, dep, date) {
  //launch browser
  const browser = await puppeteer.launch();
  //Open new page/tab
  const page = await browser.newPage();
  //Go to URL
  await page.goto(testURL);
  //Human Bahavior - Timeout for 2 secs
  await page.waitForTimeout(2000).then(_ => console.log('Waited.'));

  //Grab flight number
  const e = await page.waitForXPath('/html/body/div[2]/div/div/div/div[2]/div[2]/div/div[2]/div/section/div/div[1]/div[2]/section/div[6]/span/span/ul/li[1]/div[1]/div/div/button/span[1]').then(() => console.log(`Found XPATH ${e[0]}`));

  browser.close();
}


//export module source: https://youtu.be/nt9M-rlbWc8
module.exports = {
  pageScrap: pageScrap,
}
