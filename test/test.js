console.log('test.js is running bro');

var Twit = require('twit');
var config = require('../config');

var T = new Twit(config);

var exec = require('child_process').exec;
var fs = require('fs');

TweetMedia();
function TweetMedia(){
var cmd = 'processing-java --sketch="C:\\Users\\Admin\\Desktop\\twitter-bot\\tutorial\\rainbow" --run'
exec(cmd, processing);

function processing(){
	var filename = 'rainbow/output.png';
	var b64content = fs.readFileSync(filename, { encoding: 'base64' })

	// first we must post the media to Twitter
	T.post('media/upload', 
		  {media_data: b64content }, 
		  function (err, data, response) {
			var mediaIdStr = data.media_id_string
			var altText = "Amazing dotted pattern in black background"
			var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
	
	T.post('media/metadata/create', 
		   meta_params, 
		   function (err, data, response) {
				if (!err) {
      // now we can reference the media and post a tweet (media will attach to the tweet)
				var params = { status: '#Naruto Working on @shiffman video tutorial 15.6: Tweeting images with Processing - Twitter Bot Tutorial and it is working ', media_ids: [mediaIdStr] }
				T.post('statuses/update', 
					   params, 
					   function (err, data, response) {
							console.log(data)
						})
					}
			})
		})
	}
}