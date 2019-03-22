<h1 align="center">
  Anti Captcha SDK
  <br>
  <br>
</h1>

<h4 align="center">NodeJS API SDK for [Anti Captcha](https://anti-captcha.com) service</h4>
<br>


## Install

```bash
# install by YARN
yarn add resolve-anticaptcha

# or by NPM
npm isntall --save resolve-anticaptcha
```

## Usage

```js

import AntiCaptcha from 'resolve-anticaptcha';

const antiCaptcha = new AntiCaptcha('<your API Key>');

antiCaptcha.resolveNoCaptcha(
    'https://my-website-url.com',               // Website URL with Google Recaptcha
    '6Lc_aCMTAAAAABx7u2N0D1XnVbI_v6ZdbM6rYf16'  // Google Recaptcha Key
).then((response) => {
    console.log(response);
});
```
Response:

```json
{
  "errorId": 0,
  "status": "ready",
  "solution": {
    "gRecaptchaResponse":"3AHJ_VuvYIBNBW5yyv0zRYJ75VkOKvhKj9_xGBJKnQimF72rfoq3Iy-DyGHMwLAo6a3"
  },
  "cost": "0.000700",
  "ip": "46.98.54.221",
  "createTime": 1472205564,
  "endTime": 1472205570,
  "solveCount": "0"
}
```
