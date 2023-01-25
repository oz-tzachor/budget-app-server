const puppeteer = require("puppeteer");
// console.log("trying poop");
let browser;
let chartClass = "highcharts-background";
let chartSelector = "#highcharts-0 > svg > rect";
let mainDataSelector =
  "body > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(13) > div";
let timeSelector = mainDataSelector + " > b:nth-child(3)";
let zips = [144, 145, 146];
const grabData = async (zip) => {
  try {
    let address = `https://www.pkk.bycomputers.com/index.php?zipcode=${zip}`;

    console.log("started:", address);
    //Initial Navigation
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(address, { waitUntil: "networkidle0" });
    //
    //Start scrap
    await page.waitForSelector(mainDataSelector);
    let dataEl = await page.$eval(mainDataSelector, (element) => {
      return element.innerHTML;
    });
    let timeEl = await page.$eval(timeSelector, (ele) => {
      return ele.innerHTML;
    });
    dataEl = dataEl.toString();
    // console.log('data el',dataEl);
    let startTitle = dataEl.indexOf(">") + 1;
    let endTtile = dataEl.indexOf("</");
    let title = dataEl
      .substring(startTitle, endTtile)
      .split("")
      .reverse()
      .join("");
    console.log("Title:", title);
    //Date
    let startDate = dataEl.indexOf("2023");
    let end = dataEl.length;
    let date = dataEl.substring(startDate, end);
    console.log("Date of update", date);
    console.log("Value of update", timeEl);
    results.push({ title, date, timeEl });
    // await element.screenshot({
    //   path: `./screenshots/${Date.now()} - adam-hizme.png`,
    // });
    //
    await browser.close();
  } catch (e) {
    await browser.close();

    console.log("e", e);
  }
};
let results = [];
let indexInZips = 0;
let allZips = zips.length;
let runFunc = (index, callback) => {
  grabData(zips[index]).then(() => {
    console.log("grap ended!");
    callback();
  });
};
let startIt = () => {
  let callBack = () => {
    indexInZips++;
    if (indexInZips < allZips) {
      runFunc(indexInZips, callBack);
    } else {
      console.log("Done!");
      console.log(results);
    }
  };
  runFunc(indexInZips, callBack);
};
startIt();
// grabData();
