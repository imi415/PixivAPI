'use strict';

var request = require('request');
var fs = require('fs');
var userAgent = 'PixivAndroidApp/4.9.11';
var configLocation = __dirname + '/config.json';

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
  let URL = 'https://public-api.secure.pixiv.net/v1/users/'
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
  let URL = 'https://public-api.secure.pixiv.net/v1/users/'
  + userId
  + '/following.json?profile_image_sizes=px_170x170&include_stats=1&include_profile=1&include_contacts=1&include_workspace=1&get_secure_url=1';
  request({
    url: URL,
    headers: {
      'Authorization': 'Bearer ' + userInfo.user.response.access_token,
      'User-Agent': userAgent
    }
  }, (err, response, body) => {
    if(err) console.log(err);
    callback(JSON.parse(body));
  });
}

exports.getUserWork = function getUserWork(userId, userInfo, callback) {
  let URL = 'https://public-api.secure.pixiv.net/v1/users/'
  + userId
  + '/works.json?image_sizes=px_128x128%2Cpx_480mw%2Clarge&page=1&per_page=50&get_secure_url=1';
  request({
    url: URL,
    headers: {
      'Authorization': 'Bearer ' + userInfo.user.response.access_token,
      'User-Agent': userAgent
    }
  }, (err, response, body) => {
    if(err) console.log(err);
    callback(JSON.parse(body));
  });
}

exports.getUserFavorite = function getUserFavorite(userId, userInfo, callback) {
  let URL = 'https://public-api.secure.pixiv.net/v1/users/'
  + userId
  + '/favorite_works.json?image_sizes=px_128x128%2Cpx_480mw%2Clarge&page=1&per_page=50&publicity=public&get_secure_url=1';
  request({
    url: URL,
    headers: {
      'Authorization': 'Bearer ' + userInfo.user.response.access_token,
      'User-Agent': userAgent
    }
  }, (err, response, body) => {
    if(err) console.log(err);
    callback(JSON.parse(body));
  });
}

exports.getWorkProfile = function getWorkProfile(workId, userInfo, callback) {
  let URL = 'https://public-api.secure.pixiv.net/v1/works/'
  + workId
  + '.json?include_sanity_level=true&image_sizes=px_480mw%2Clarge&include_stats=true&caption_format=html&get_secure_url=1 ';
  request({
    url: URL,
    headers: {
      'Authorization': 'Bearer ' + userInfo.user.response.access_token,
      'User-Agent': userAgent
    }
  }, (err, response, body) => {
    if(err) console.log(err);
    callback(JSON.parse(body));
  });
}

exports.downloadWork = function downloadWork(workProfile, path, callback) {
  let referer = 'http://spapi.pixiv-app.net/single';
  let URL = workProfile.response[0].image_urls.large;
  let filename = URL.split('/')[URL.split('/').length - 1];
  console.log(filename);
  fs.stat(path, (error, data) => {
    if(error) {
      console.log('D_!E');
      fs.mkdir(path, () => {
        request({
          url: URL,
          headers: {
            'User-Agent': userAgent,
            'Referer': referer
          }
        }, (err, response, body) => {
          if(err) console.log(err);
          callback(body);
        }).pipe(fs.createWriteStream(path + filename));

      });
    }
    else {
      fs.stat(path + filename, (error, data) => {
        if(error) {
          console.log('D_E,F_!E');
          request({
            url: URL,
            headers: {
              'User-Agent': userAgent,
              'Referer': referer
            }
          }, (err, response, body) => {
            if(err) console.log(err);
            callback(body);
          }).pipe(fs.createWriteStream(path + filename));
        }
      });
    }
    console.log('D_E,F_E');
  });
}

exports.downloadAllWorkByUser = function downloadAllWorkByUser(userId, userInfo, path, callback) {
  this.getUserWork(userId, userInfo,(UserWork) => {
    UserWork.response.forEach((value, index, array) => {
      this.getWorkProfile(value.id, userInfo, (workProfile) => {
        this.downloadWork(workProfile, path + value.id + '/', (result) => {
          console.log('Downloaded ' + value.id);
        });
      });
    });
    callback('done');
  });
}

function oAuth(username, password, callback){
  let formData = {
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
    let resObject = JSON.parse(body);
    //console.log(resObject);
    let resultObject = {
      timestamp: Math.floor( new Date().getTime() / 1000 ),
      username: username,
      password: password,
      user: resObject
    }
    callback(resultObject);
  });
}

function saveUserInfo(user){
  fs.writeFile(configLocation, JSON.stringify(user), (err) => {
    if(err) console.log(err);
  });
}

function loadUserInfo(callback){
  fs.stat(configLocation, (err, data) => {
    if (err) fs.writeFile(configLocation, '{"status": "-1"}', (err) => {
      console.log('New config created');
      callback(JSON.parse('{}'));
    });
    else{
      fs.readFile(configLocation, (err, data) =>{
      if(err){
        console.log(err);
        callback(JSON.parse('{}'));
      }
      callback(JSON.parse(data.toString()));
    });
  }
  });

}

function verifyUserInfo(user){
  if(Math.floor(user.timestamp) + Math.floor(user.user.response.expires_in) > Math.floor( new Date().getTime() / 1000 )) return true;
  else return false;
}
