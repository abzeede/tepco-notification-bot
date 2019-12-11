const cron = require('node-cron')
const reports = require('../services/reports')
const lineClient = require('../services/line')

exports.createLineNotificationWorker = schedule => {
  return cron.schedule(
    schedule,
    async () => {
      console.log('notification worker start')

      const message = await reports.getUsageMessage()
      lineClient
        .pushMessage(process.env.LINE_USER_ID, {
          type: 'text',
          text: message,
        })
        .then(() => {
          console.log('message sent!')
        })
        .catch(err => {
          console.log('push message error: ', err)
        })

      console.log('notification worker end')
    },
    {
      scheduled: true,
      timezone: 'Asia/Tokyo',
    }
  )
}
