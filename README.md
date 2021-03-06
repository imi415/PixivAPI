# PixivAPI
A test-only API package for pixiv.
Require:Node.JS 4.0.0 and later.
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
Get user's illustrations
```javascript
pixiv.getUserIllustrate(userId, userInfo, (res) => {
    //do something
  });
  ```
The list is an array which contains illustration objects.
Get user's favorite works
```javascript
pixiv.getUserFavorite(userId, userInfo, (res) => {
    //do something
  });
  ```
The list is also an array which contains illustration objects.
Get work profile
```javascript
pixiv.getWorkProfile(workId, userInfo, (res) => {
    //do something
  });
  ```
The res object contains the work profile, which can be used to download a work.
Download a single work
```javascript
pixiv.downloadWork(workProfile, path, (res) => {
    //do something
  });
  ```
workProfile can use directly from getWorkProfile. The res object contains the response body.
Download All work by user ID
```javascript
pixiv.downloadAllWorkByUser(userId, userInfo, path, (ststus) => {
    //do something
  });
```
It will download all works into seperately directories, named by workId.
