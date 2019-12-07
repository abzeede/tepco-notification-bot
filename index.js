require('dotenv').config()
const puppeteer = require('puppeteer')
const line = require('@line/bot-sdk')
const axios = require('axios')
const qs = require('querystring')
const express = require('express')
const bodyParser = require('body-parser')
const get = require('lodash/get')
const cron = require('node-cron')

const TEPCO_LOGIN_URL =
  'https://www.kurashi.tepco.co.jp/pf/ja/pc/mypage/home/index.page'
const USERNAME = process.env.TEPCO_USERNAME
const PASSWORD = process.env.TEPCO_PASSWORD

const getUsageReport = async (year, month) => {
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
  const data = await response.json()

  await browser.close()

  return data
}

const getYesterdayUsage = report => {
  const yesterdayDate = new Date().getDate() - 1
  return get(report, `data[${yesterdayDate - 1}].kwh`, '-')
}

const getTotalUsageInMonth = (report = []) => {
  return get(report, 'data', []).reduce((totalUsage, usage) => {
    return totalUsage + parseFloat(usage.kwh)
  }, 0)
}

// setup express
app = express()
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// webhook route
app.post('/webhook', (req, res) => {
  console.log(JSON.stringify(req.body))
  res.sendStatus(200)
})

app.listen(8000, () =>
  console.log(`Tepco Notification bot listening on port 8000!`)
)

// cron job
cron.schedule('0 1 * * *', async () => {
  const current = new Date()
  const report = await getUsageReport(
    current.getFullYear(),
    current.getMonth() + 1
  )
  const yesterdayUsage = getYesterdayUsage(report)
  const totalUsageInMonth = getTotalUsageInMonth(report)

  const client = new line.Client({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  })
  client
    .pushMessage(process.env.LINE_USER_ID, {
      type: 'text',
      text: `Yesterday: ${yesterdayUsage} kwh\nTotal: ${totalUsageInMonth.toFixed(
        2
      )} kwh`,
    })
    .then(() => {
      console.log('message sent!')
    })
    .catch(err => {
      console.log('push message error: ', err)
    })
})
