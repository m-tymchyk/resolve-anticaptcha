<h1 align="center">
  Anti Captcha SDK
  <br>
  <br>
</h1>

<h4 align="center">NodeJS API SDK for <a href="https://anti-captcha.com">Anti Captcha</a> service</h4>
<br>

<p align="center">
<a href="https://badge.fury.io/js/resolve-anticaptcha"><img src="https://badge.fury.io/js/resolve-anticaptcha.svg" alt="npm version" height="18"/></a>
<a href="https://badge.fury.io/js/resolve-anticaptcha"><img alt="npm" src="https://img.shields.io/npm/dt/resolve-anticaptcha?style=plastic"/></a>
</p>
<br>

## Install

```bash
# install by YARN
yarn add resolve-anticaptcha

# or by NPM
npm install --save resolve-anticaptcha
```

## Usage


### Image captcha to Text
```js
import AntiCaptcha, { getImageData } from 'resolve-anticaptcha';

const antiCaptcha = new AntiCaptcha('<your API Key>');

const base64ImageData = getImageData('/path/to/image.jpg');
antiCaptcha
    .resolveImage(base64ImageData)
    .then((response) => {
        console.log(response);
    });
```

#### Response:
```json
{
  "errorId": 0,
  "status": "ready",
  "solution": {
    "text": "rke3i",
    "url": "http://webaddress.com/captcha.jpg"
  },
  "cost": "0.000700",
  "ip": "46.98.54.221",
  "createTime": 1472205564,
  "endTime": 1472205570,
  "solveCount": "0"
}
```


### Google reCAPTCHA V2 no Proxy
```js
import AntiCaptcha from 'resolve-anticaptcha';

const antiCaptcha = new AntiCaptcha('<your API Key>');

antiCaptcha
    .resolveRecaptchaV2(
        'https://my-website-url.com',               // Website URL with Google Recaptcha
        '6Lc_aCMTAAAAABx7u2N0D1XnVbI_v6ZdbM6rYf16'  // Google Recaptcha Key
    )
    .then((response) => {
        console.log(response);
    });
```

#### Response:
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


### Google reCAPTCHA V2 with Proxy
```js
import AntiCaptcha from 'resolve-anticaptcha';

const antiCaptcha = new AntiCaptcha('<your API Key>');

const proxyOptions = {
    // http, socks4, socks5 (required)
    proxyType: 'http',         

    // your proxy Address (required)
    proxyAddress: '8.8.8.8',    

    // your proxy port (required)
    proxyPort: 8888,            

    // (optional)
    proxyLogin: 'login',        
    
    // (optional)
    proxyPassword: 'password', 

    // Browser's User-Agent used in emulation (required for Google reCaptcha)
    userAgent: 'MODERN_USER_AGENT_HERE',          

    // Additional cookies that we should use in Google domains (optional)
    cookies: 'cookiename1=cookievalue1; cookiename2=cookievalue2'                 
};

antiCaptcha
    .resolveRecaptchaV2(
        'https://my-website-url.com',                // Website URL with Google reCaptcha
        '6Lc_aCMTAAAAABx7u2N0D1XnVbI_v6ZdbM6rYf16',  // Google Recaptcha Key,
        true,                                        // Use TRUE for invisible reCaptcha
        proxyOptions
    )
    .then((response) => {
        console.log(response);
    });
```

#### Response:
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


### Google reCAPTCHA V3
```js
import AntiCaptcha from 'resolve-anticaptcha';

const antiCaptcha = new AntiCaptcha('<your API Key>');

antiCaptcha
    .resolveRecaptchaV3(
        'https://my-website-url.com',                // (required) Website URL with Google Recaptcha
        '6Lc_aCMTAAAAABx7u2N0D1XnVbI_v6ZdbM6rYf16',  // (required) Google Recaptcha Key
        0.3,                                         // (required) One of 0.3, 0.7. 0.9
        'myverify',                                  // (optional) Recaptcha's "action" value
        false,                                       // (optional) Set this flag to "true" if you need this V3 solved
                                                     //            with Enterprise API.
    )
    .then((response) => {
        console.log(response);
    });
```

#### Response:
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