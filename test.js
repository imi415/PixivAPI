'use strict';

var pixiv = require('./index.js');
var colors = require('colors');
var cliTable = require('cli-table');

var resultTable = new cliTable({
    head: ['Test Items', 'Results']
  , colWidths: [25, 10]
});

pixiv.authenticate({username: 'imi415.public@gmail.com', password: 'Sim14154'}, (userInfo) => {

  //Test1: authenticate
  //console.log(userInfo);
  let status = colors.red(1);;
  if(userInfo.user.response.user.id == 17075947) status = colors.green(0);
  resultTable.push([colors.blue('authenticate'), status]);

  //Test2: getUserProfile
  pixiv.getUserProfile(userInfo.user.response.user.id, userInfo, (res) => {
    //console.log(res);
    let status = colors.red(1);;
    if(res.response[0].id == 17075947) status = colors.green(0);
    resultTable.push([colors.blue('getUserProfile'), status]);
  });

  //Test3: getUserFollowing
  pixiv.getUserFollowing(586538, userInfo, (res) => {
    //console.log(res);
    let status = colors.red(1);
    if(res.status == 'success') status = colors.green(0);
    resultTable.push([colors.blue('getUserFollowing'), status]);
  });

  //Test4: getUserWork
  pixiv.getUserWork(27691, userInfo, (res) =>{
    //console.log(res);
    let status = colors.red(1);;
    if(res.status == 'success') status = colors.green(0);
    resultTable.push([colors.blue('getUserWork'), status]);

  });

  //Test5: getUserFavorite
  pixiv.getUserFavorite(1601715, userInfo, (res) =>{
    //console.log(res);
    let status = colors.red(1);;
    if(res.status == 'success') status = colors.green(0);
    resultTable.push([colors.blue('getUserFavorite'), status]);
  });

  //Test6: getWorkProfile
  pixiv.getWorkProfile(53610270, userInfo, (res) =>{
    //console.log(res);
    let status = colors.red(1);;
    if(res.status == 'success') status = colors.green(0);
    resultTable.push([colors.blue('getWorkProfile'), status]);
    pixiv.downloadWork(res, './', ()=>{
      resultTable.push([colors.blue('downloadWork'), colors.green(0)]);
    });
  });

  pixiv.downloadAllWorkByUser(27691, userInfo, './test/downloaded/', (res) => {
    //console.log(res);
    resultTable.push([colors.blue('downloadAllWorkByUser'), colors.green(0)]);
    displayResults();
  });
});

function displayResults(){
  console.log(colors.blue('I am waiting 10s for all request completed...'));
  setTimeout(() => {
    let is_success = true;
    let resultTableString = resultTable.toString();
    console.log(resultTableString);
    if(resultTableString.indexOf(colors.red('1')) != -1) is_success = false;
    //if(is_success) process.exit(0);
    //else process.exit(-1);
  }, 100000);
}
