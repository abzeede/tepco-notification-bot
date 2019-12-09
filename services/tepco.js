const puppeteer = require('puppeteer')
const tepcoUsages = require('../db/usages')

const TEPCO_LOGIN_URL =
  'https://www.kurashi.tepco.co.jp/pf/ja/pc/mypage/home/index.page'
const USERNAME = process.env.TEPCO_USERNAME
const PASSWORD = process.env.TEPCO_PASSWORD

const save = (reports = [], year) => {
  const insertPromises = reports
    .filter(report => report.kwh !== '-0')
    .map(report => tepcoUsages.add({ ...report, year }))
  return Promise.all(insertPromises)
}

exports.getUsageReport = async (year, month) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] }) // https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md
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

exports.getYesterdayUsage = () => {
  const yesterday = new Date(Date.now() - 864e5) // 24 * 60 * 60 * 1000

  return tepcoUsages.collection
    .doc(
      `${yesterday.getFullYear()}-${yesterday.getMonth() +
        1}-${yesterday.getDate()}`
    )
    .get()
    .then(usage => {
      console.log(usage.get('kwh'))
      return parseFloat(usage.get('kwh'))
    })
}

exports.getTotalUsageInMonth = (year, month) => {
  let total = 0
  return tepcoUsages.collection
    .where('month', '==', month.toString())
    .get()
    .then(usages => {
      if (!usages.empty) {
        usages.forEach(usage => {
          total += parseFloat(usage.get('kwh'))
        })
      }

      return total
    })
}
