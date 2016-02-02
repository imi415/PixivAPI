var request = require('request');
var fs = require('fs');

exports.authenticate = function authenticate(user, callback){
  loadUserInfo((userInfo) => {
    if(!userInfo){
      oAuth(user.username, user.password, (res) => {
        userInfo = res;
        saveUserInfo(userInfo);
        callback(userInfo);
      });
    }
    else if(userInfo.username != user.username || !verifyUserInfo(userInfo)) {
      oAuth(user.username, user.password, (res) => {
        userInfo = res;
        saveUserInfo(userInfo);
        callback(userInfo);
      });
    }
    else callback(userInfo);
  });
}

exports.getUserProfile = function getUserProfile(userId, userInfo, callback) {
  var URL = 'https://public-api.secure.pixiv.net/v1/users/'
  + userId
  + '.json?profile_image_sizes=px_170x170&include_stats=1&include_profile=1&include_contacts=1&include_workspace=1&get_secure_url=1';
  request({
    url: URL,
    headers: {
      'Authorization': 'Bearer ' + userInfo.user.response.access_token
    }
  }, (err, response, body) => {
    if(err) console.log(err);
    callback(JSON.parse(body));
  });
}

exports.getUserFollowing = function getUserFollowing(userId, userInfo, callback) {
  var URL = 'https://public-api.secure.pixiv.net/v1/users/'
  + userId
  + '/following.json?profile_image_sizes=px_170x170&include_stats=1&include_profile=1&include_contacts=1&include_workspace=1&get_secure_url=1';
  request({
    url: URL,
    headers: {
      'Authorization': 'Bearer ' + userInfo.user.response.access_token,
      'User-Agent': 'PixivAndroidApp/4.9.11'
    }
  }, (err, response, body) => {
    if(err) console.log(err);
    callback(JSON.parse(body));
  });
}

function oAuth(username, password, callback){
  var formData = {
    client_id: 'BVO2E8vAAikgUBW8FYpi6amXOjQj',
    client_secret: 'LI1WsFUDrrquaINOdarrJclCrkTtc3eojCOswlog',
    grant_type: 'password',
    username: username,
    password: password,
    device_token: 'pixiv'
  };
  request.post({
    url: 'https://oauth.secure.pixiv.net/auth/token',
    headers: {
      'User-Agent': ''
    },
    formData: formData
  }, (error, response, body) => {
    //console.log(body);
    var resObject = JSON.parse(body);
    //console.log(resObject);
    var resultObject = {
      timestamp: Math.floor( new Date().getTime() / 1000 ),
      username: username,
      password: password,
      user: resObject
    }
    callback(resultObject);
  });
}

function saveUserInfo(user){
  fs.writeFile('./config.json', JSON.stringify(user), (err) => {
    if(err) console.log(err);
  });
}

function loadUserInfo(callback){
  fs.stat('./config.json', (err, data) => {
    if (err) fs.writeFile('./config.json', '{"status": "-1"}', (err) => {
      fs.readFile('./config.json', (err, data) =>{
        if(err){
          console.log(err);
          callback(JSON.parse('{}'));
        }
        callback(JSON.parse(data.toString()));
      });
    });
  });

}

function verifyUserInfo(user){
  //console.log(Math.floor(user.timestamp));
  //console.log(Math.floor(user.user.response.expires_in));
  //console.log(Math.floor( new Date().getTime() / 1000 ));
  if(Math.floor(user.timestamp) + Math.floor(user.user.response.expires_in) > Math.floor( new Date().getTime() / 1000 )) return true;
  else return false;
}
