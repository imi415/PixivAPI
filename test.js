var api = require('./index.js');

api.authenticate({username: 'imi415.public@gmail.com', password: 'Sim14154'}, (userInfo) => {
  console.log(userInfo);
  api.getUserProfile(userInfo.user.response.user.id, userInfo, (res) => {
    console.log(res);
  });
api.getUserFollowing(586538, userInfo, (res) => {
    console.log(res);
    console.log(userInfo.user.response.user.id);
    if(userInfo.user.response.user.id == 17075947) process.exit(0);
    else process.exit(1);
  });
});
