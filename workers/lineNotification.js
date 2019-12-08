const cron = require('node-cron')
const line = require('@line/bot-sdk')
const tepco = require('../services/tepco')
const config = require('../config')
const usages = require('../db/usages')

exports.createLineNotificationWorker = schedule => {
  return cron.schedule(schedule, async () => {
    const current = new Date()
    const report = await tepco.getUsageReport(
      current.getFullYear(),
      current.getMonth() + 1
    )
    const yesterdayUsage = tepco.getYesterdayUsage(report)
    const totalUsageInMonth = tepco.getTotalUsageInMonth(report)

    report.save()

    const client = new line.Client({
      channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    })
    client
      .pushMessage(process.env.LINE_USER_ID, {
        type: 'text',
        text: `Yesterday: ${yesterdayUsage} kwh\nTotal: ${totalUsageInMonth.toFixed(
          2
        )} kwh\nPrice(EST): ${(
          totalUsageInMonth * config.PRICE_PRE_UNIT
        ).toFixed(2)} Yen`,
      })
      .then(() => {
        console.log('message sent!')
      })
      .catch(err => {
        console.log('push message error: ', err)
      })
  })
}
