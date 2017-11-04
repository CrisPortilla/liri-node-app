var keys = require('./keys.js');

var request = require('request');

var fs = require("fs");

var Twitter = require('twitter');

//var Spotify = require('spotify');
var Spotify = require('node-spotify-api');

var command = process.argv[2];
var title = process.argv[3];

function MyTweets() {
    var client = new Twitter(keys.twitterKeys);
    var params = {
        screen_name: 'liricode',
        count: 20
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Here's what this ser has tweeted---------------------------");
                    for (var t = 0; t < tweets.length; t++) {
                        console.log(tweets[t].text);
                        console.log(tweets[t].created_at);
                        console.log('-------------------------------------------');

                /*
                fs.appendFile("log.txt", "Tweet#"+t+" Tweet: "+tweets[t].text +" \nCreated: "+tweets[t].created_at +"\n", function (error) {
                    if(err){
                        console.log(err);
                    }
                    else {
                        console.log("Added!")
                    }
                });   */
            }
        }
    });
}

function Spotthissong(song) {
    var spotify = new Spotify({
        id: '38f6696102f8496682b27f87b9df0523',
        secret: '82a9f692fc8441e18966b2d3edf6a17d'
    });

    if (!song) {
        song = 'The Sign';
    }

    spotify
        .search({
            type: 'track',
            query: song
        })
        .then(function (response) {

            var songInfo = response.tracks.items[0];

            console.log('I SPOTify this song------------------------------');
            console.log('Album: ', songInfo.album.name);
            console.log('Artist Name: ', songInfo.artists[0].name);
            console.log('Preview Link: ', songInfo.preview_url);
            console.log('Song Name: ', songInfo.name);
            console.log('-------------------------------------------------');
        })
        .catch(function (err) {
            console.log(err);
        });

}

function Moviethis(movie) {
    if (!movie) {
        movie = 'Mr.Nobody'
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&apikey=40e9cece";
    console.log(queryUrl);



    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movieInfo = JSON.parse(body);

            console.log('Found it!------------------------------------------------------');
            console.log('Title: ', movieInfo.Title);
            console.log('Came out in: ', movieInfo.Year);
            console.log('Rating: ', movieInfo.Ratings[0].Value);
            console.log('Rotten Tomatoes Rating ', movieInfo.Ratings[1].Value);
            console.log('Country made in ', movieInfo.Country);
            console.log('Language: ', movieInfo.Language);
            console.log('Plot: ', movieInfo.Plot);
            console.log('Actors: ', movieInfo.Actors);
            console.log('-----------------------------------------------------------------');
        }
    });
}

function Oncommand() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);

        var dataArr = data.split(",");
        command = dataArr[0];
        search = dataArr[1];

        if (command === 'spotify-this-song') {
            Spotthissong(search);
        }
        if (command === 'movie-this') {
            Moviethis(search);
        }

    });
}


switch (command) {
    case "my-tweets":
        MyTweets();
        break;

    case "spotify-this-song":
        Spotthissong(title);
        break;

    case "movie-this":
        Moviethis(title);
        break;

    case "do-what-it-says":
        Oncommand();
        break;

    default:
        console.log("err w/command");
}