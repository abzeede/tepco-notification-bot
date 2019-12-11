require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const reportNotification = require('./workers/reportNotification')

const PORT = process.env.PORT || 8000

// setup express
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (_, res) => {
  res.send('大丈夫です')
})

// webhook route
app.post('/webhook', (req, res) => {
  console.log(JSON.stringify(req.body))
  res.sendStatus(200)
})

// cron job
reportNotification
  .createLineNotificationWorker(process.env.NOTIFY_AT || '0 8 * * *')
  .start()

app.listen(PORT, () =>
  console.log(`Tepco Notification bot listening on port ${PORT}!`)
)
