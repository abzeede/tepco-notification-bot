require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const lineNotification = require('./workers/lineNotification')

// setup express
const app = express()
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// webhook route
app.post('/webhook', (req, res) => {
  console.log(JSON.stringify(req.body))
  res.sendStatus(200)
})

// cron job
lineNotification.createLineNotificationWorker('05 22 * * *').start()
console.log('line notification worker is running')

app.listen(8000, () =>
  console.log(`Tepco Notification bot listening on port 8000!`)
)
