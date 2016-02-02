# PixivAPI
A test-only API package for pixiv.  
[![Build Status](https://travis-ci.org/imi415/PixivAPI.svg?branch=master)](https://travis-ci.org/imi415/PixivAPI)
#Usage
Create an config object which contains your pixiv username and password.  
```javascript
var userConfig = {
    username: 'your username',
    password: 'your password'
  };
```
Then require this api module  
```javascript
var pixiv = require('pixivapi');
```
Authenticate with your username and password  
```javascript
pixiv.authenticate(userConfig, (userInfo) => {
    //do something
  });
```
The callback object contains a timestamp , your username, your password, as well as the response object from pixiv's api server.  
get user profile  
```javascript
  pixiv.getUserProfile(userId, userInfo, (res) => {
    //do something
  });
```
The userInfo object is needed for bearer authentication.  
Get user's following list  
```javascript
pixiv.getUserFollowing(userId, userInfo, (res) => {
    //do something
  });
```
The list is an array which contains a brief profile infomation of each user.
