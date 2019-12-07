require("dotenv").config();
const puppeteer = require("puppeteer");

const TEPCO_LOGIN_URL =
  "https://www.kurashi.tepco.co.jp/pf/ja/pc/mypage/home/index.page";
const USERNAME = process.env.TEPCO_USERNAME;
const PASSWORD = process.env.TEPCO_PASSWORD;

const getUsageReport = async (year, month) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // authentication
  await page.goto(TEPCO_LOGIN_URL);

  await page.type('input[name="ACCOUNTUID"]', USERNAME);

  const passwordElm = await page.$('input[name="PASSWORD"]');
  await passwordElm.type(PASSWORD);
  await Promise.all([
    passwordElm.press("Enter"),
    page.waitForNavigation({ waitUntil: "networkidle2" }) // wait until it's completed authentication
  ]);

  // get report
  const response = await page.goto(
    `https://www.kurashi.tepco.co.jp/pf/ja/res/mypage/learn/comparison.page?_ajax_request=1&year=${year}&month=${month}`
  );
  const data = await response.json();

  await browser.close();

  return data;
};

(async () => {
  console.log(await getUsageReport(2019, 12));
})();
