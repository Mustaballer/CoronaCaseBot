//twitter needed dependencies
console.log('stats.js is running');
var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);

// webscraper dependencies
const puppeteer = require('puppeteer');
const url = 'https://www.worldometers.info/coronavirus/';
// array for details

/**
 * Require the cheerio library.
 */
const cheerio = require('cheerio');

main()
  .then()
  .catch(console.error)
// RUNS every 30 mins
setInterval(main, 1000 * 60 * 30);

async function main() {
    
    try {
        
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            /**
             * Use the default headless mode (don't show the browser).
             */
            headless: true
        });

        const page = await browser.newPage();

        await page.goto(url);

        /**
        * Get page content as HTML.
        */
        const content = await page.content();

        /**
        * Load content in cheerio.
        */
        const $ = cheerio.load(content);
        /**
        * Create an array to save the article titles.
        */
        const facts = [];
        /**
        * Access div[class=maincounter-number class. slice() is used to access
        * only he first 3 HTML elements that have maincounter-number class.
        * We iterate each of those 3 elements using each() method.
        */
        $('div[class=maincounter-number]').slice(0, 3).each((idx, elem) => {
            /**
            * Get the inner HTML which corresponds to the fact in text format.
            */
            const fact = $(elem).text();

            /**
            * Push the title in facts array.
            */
            facts.push(fact);
        })

        browser.close();
        
        // get rid of spaces in total cases CHANGE BELOW
        let totalString = facts[0].replace(/,/g,"").replace(" ", "");
        var totalC = parseInt(totalString);
        
        // get rid of spaces in deaths
        let d = facts[1].replace(/,/g,"").replace(" ", "");
        var deaths = parseInt(d);
        // find percentage of deaths to total
        let deathPercent = (deaths / totalC) * 100;
        var rounded = Math.round(deathPercent * 10) / 10;
        
        // get rid of spaces in recovered
        let r = facts[2].replace(/,/g,"").replace(" ", "");
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
                console.log(err);
            }
            else {
                console.log("It worked");
            }
        }
        
    } catch(err) {
        console.log(err);
    }
  
}

