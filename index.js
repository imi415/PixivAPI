var request = require('request');

request({
  url: 'http://www.pixiv.net',
  headers: {
    'User-Agent': 'Pixiv-Android/5.0.4'
  }
}, (error, response, body) => {
  console.log(body);
});
