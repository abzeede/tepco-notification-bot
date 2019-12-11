const line = require('@line/bot-sdk')

const lineClient = new line.Client({
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
})

module.exports = lineClient
