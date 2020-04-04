//twitter needed dependencies
console.log('stats.js is running');
var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);

// webscraper dependencies
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.worldometers.info/coronavirus/';
// array for details
const facts = [];


tweetIt();
// CHANGE BEFORE PUBLISHING
setInterval(tweetIt, 1000 * 20);
function tweetIt() { 
    puppeteer
      .launch({ args: ['--no-sandbox'] })
      .then(function(browser) {
        return browser.newPage();
      })
      .then(function(page) {
        return page.goto(url).then(function() {
          return page.content();
        });
      })
      .then(function(html) {
        $('div[class=maincounter-number]', html).each(function(i) {
          facts[i] = $(this).text();
        });
        // get rid of spaces in total cases CHANGE BELOW
        let totalString = facts[0].replace(/,/g,"").replace(" ", "");
        var totalC = parseInt(totalString);
        
        // get rid of spaces in deaths
        let d = facts[1].replace(",",'').replace(/ /g,'');
        var deaths = parseInt(d);
        // find percentage of deaths to total
        let deathPercent = (deaths / totalC) * 100;
        var rounded = Math.round(deathPercent * 10) / 10;
        
        // get rid of spaces in recovered
        let r = facts[2].replace(",",'').replace(/ /g,'');
        var recovered = parseInt(r);
        // find percentage of recoveries to total
        let recoveredPercent = (recovered / totalC) * 100;
        var roundRecovery = Math.round(recoveredPercent * 10) / 10;
        
        console.log("Total corona cases is " + totalC);
        
        var tweet = { 
            status: '#corona #coronavirus #COVID19 #COVID2019 #CoronavirusOutbreak #coronavirusupdates #StayAwareStaySafe \r\n'+ '𝐂𝐨𝐫𝐨𝐧𝐚𝐯𝐢𝐫𝐮𝐬 𝐜𝐚𝐬𝐞𝐬: '+totalC + '\r\n𝐃𝐞𝐚𝐭𝐡𝐬: '+deaths + ' ( '+rounded + '% 𝚘𝚏 𝚝𝚘𝚝𝚊𝚕 )' + '\r\n𝐑𝐞𝐜𝐨𝐯𝐞𝐫𝐞𝐝: '+recovered + ' ( '+roundRecovery + '% 𝚘𝚏 𝚝𝚘𝚝𝚊𝚕 )'
        };
        
        T.post('statuses/update', tweet, tweeted);
        function tweeted(err, data, response) {
            if (err) {
                console.log("Something went wrong");
            }
            else {
                console.log("It worked");
            }
        }
      })
      .catch(function(err) {
        //handle error
        console.log('error executing parsing maincounter-number class');
      });
    
}



