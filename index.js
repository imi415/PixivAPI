var request = require('request');

oAuth('imi415.public@gmail.com', 'Sim14154');

function oAuth(username, password){
  var formData = {
    client_id: 'BVO2E8vAAikgUBW8FYpi6amXOjQj',
    client_secret: 'LI1WsFUDrrquaINOdarrJclCrkTtc3eojCOswlog',
    grant_type: 'password',
    username: username,
    password: password,
    device_token: 'pixiv',

  };
  request.post({
    url: 'https://oauth.secure.pixiv.net/auth/token',
    headers: {
      'User-Agent': ''
    },
    formData: formData
  }, (error, response, body) => {
    console.log(body);
  });
}
