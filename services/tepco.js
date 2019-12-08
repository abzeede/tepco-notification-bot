const puppeteer = require('puppeteer')
const get = require('lodash/get')
const tepcoUsage = require('../db/usages')

const TEPCO_LOGIN_URL =
  'https://www.kurashi.tepco.co.jp/pf/ja/pc/mypage/home/index.page'
const USERNAME = process.env.TEPCO_USERNAME
const PASSWORD = process.env.TEPCO_PASSWORD

const save = (reports = [], year) => {
  reports
    .filter(report => report.kwh !== '-0')
    .map(report => {
      tepcoUsage.add({ ...report, year })
    })
}

exports.getUsageReport = async (year, month) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // authentication
  await page.goto(TEPCO_LOGIN_URL)

  await page.type('input[name="ACCOUNTUID"]', USERNAME)

  const passwordElm = await page.$('input[name="PASSWORD"]')
  await passwordElm.type(PASSWORD)
  await Promise.all([
    passwordElm.press('Enter'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }), // wait until it's completed authentication
  ])

  // get report
  const response = await page.goto(
    `https://www.kurashi.tepco.co.jp/pf/ja/res/mypage/learn/comparison.page?_ajax_request=1&year=${year}&month=${month}`
  )
  const report = await response.json()

  await browser.close()

  return {
    ...report,
    save: () => save(report.data, year),
  }
}

exports.getYesterdayUsage = report => {
  const yesterdayDate = new Date().getDate() - 1
  return get(report, `data[${yesterdayDate - 1}].kwh`, '-')
}

exports.getTotalUsageInMonth = (report = []) => {
  return get(report, 'data', []).reduce((totalUsage, usage) => {
    return totalUsage + parseFloat(usage.kwh)
  }, 0)
}
