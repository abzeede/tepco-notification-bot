# (Unofficial) TEPCO Japan electric usage Line bot

TEPCO doesn't has an application to check or notify about my electric usage, in daily so that why I create this bot.

## How does it work?

- Use Puppeteer for scraping the information.
- Serialize the information and push message via Line bot
- Use cron job for notification every 1 AM

## WIP

- Enable to set notify time
- Cache
- Searching

## Setup

- install deps
  ```
  yarn
  ```
- setup env
  ```
  TEPCO_USERNAME=
  TEPCO_PASSWORD=
  LINE_ACCESS_TOKEN=
  LINE_USER_ID=
  ```
  **note:**

1. For Line user_id, you have to run the project and set Webhook in Line console, once you join bot room the user_id will show up in terminal
2. If you develop on local, you can use https://ngrok.com/ as proxy for your Webhook url

## Run project

```
yarn start
```

### The MIT License

Copyright (c) 2019 Abzeede

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
