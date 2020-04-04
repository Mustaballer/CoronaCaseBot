console.log('bot2.js(follow bot) is running bro');
// twitter has failed us, it doesn't work lol because stream has beend deprecated
var Twit = require('twit');
var config = require('../config');

var T = new Twit(config);

var stream = T.stream('user');

//Anytime someone follows me 
stream.on('follow', followed);

function followed(eventMsg) {
    console.log('Follow event!');
    var name = eventMsg.source.name;
    var screenName = eventMsg.source.screen_name;
    tweetIt('.@'+screenName + ' ' + name + ', do you like Naruto as well?');
}

//tweetIt();
//setInterval(tweetIt, 1000 * 20);
function tweetIt(txt) { 
    
    var tweet = { 
        status: txt
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
}