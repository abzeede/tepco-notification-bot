require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const lineNotification = require('./workers/lineNotification')
const tepco = require('./services/tepco')

const PORT = process.env.PORT || 8000

// setup express
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', res => {
  res.sendStatus(200)
})

// webhook route
app.post('/webhook', (req, res) => {
  console.log(JSON.stringify(req.body))
  res.sendStatus(200)
})

// cron job
lineNotification.createLineNotificationWorker('0 8 * * *').start()
console.log('line notification worker is running')

app.listen(PORT, () =>
  console.log(`Tepco Notification bot listening on port ${PORT}!`)
)
