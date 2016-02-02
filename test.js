var pixiv = require('./index.js');
var colors = require('colors');

var testResults = ['0'];
var testItems = ['Initial-Test'];


pixiv.authenticate({username: 'imi415.public@gmail.com', password: 'Sim14154'}, (userInfo) => {

  //Test1: authenticate
  //console.log(userInfo);
  if(userInfo.user.response.user.id == 17075947) testResults.push('0');
  else testResults.push('1');
  testItems.push('authenticate');

  //Test2: getUserProfile
  pixiv.getUserProfile(userInfo.user.response.user.id, userInfo, (res) => {
    //console.log(res);
    if(res.response[0].id == 17075947) testResults.push('0');
    else testResults.push('1');
    testItems.push('getUserProfile');
  });

  //Test3: getUserFollowing
  pixiv.getUserFollowing(586538, userInfo, (res) => {
    if(res.status == 'success') testResults.push('0');
    else testResults.push('1');
    testItems.push('getUserFollowing');
    //console.log(res);
  });

    //Test4: getUserIllustrate
  pixiv.getUserIllustrate(27691, userInfo, (res) =>{
    if(res.status == 'success') testResults.push('0');
    else testResults.push('1');
    testItems.push('getUserIllustrates');
    //console.log(res);
  });

  //Test5: getUserFavorite
  pixiv.getUserFavorite(1601715, userInfo, (res) =>{
    if(res.status == 'success') testResults.push('0');
    else testResults.push('1');
    testItems.push('getUserFavorite');
    //console.log(res);
    displayResults();
  });
});

function displayResults(){
  console.log(colors.blue('I am waiting 30s for all request completed...'));
  setTimeout(() => {
    var is_success = true;
    console.log('Test Items\tStatus')
    testItems.forEach((item, index, array) => {
      if(testResults[index] == 1) {
        is_success = false;
        console.log(colors.red(item + '\t' + testResults[index]));
      }
      else console.log(colors.green(item + '\t' + testResults[index]));
    });
    if(is_success) process.exit(0);
    else process.exit(-1);
  }, 30000);
}
