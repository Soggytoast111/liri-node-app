var fs = require("fs")
var dotenv = require("dotenv").config();
var axios = require("axios")
var Spotify = require("node-spotify-api")
var keys = require("./keys.js");
var moment = require("moment")


var prog = process.argv[2]
var spotify = new Spotify(keys.spotify);

var log4js = require('log4js');
log4js.configure({
  
    appenders: {
        cheeseLogs: { type: 'file', filename: 'log.txt' },
        console: { type: 'console', layout: { type: 'dummy' } }
      },
     categories: {
        default: { appenders: ['console', 'cheeseLogs'], level: 'trace' }
    }

})

var logger = log4js.getLogger() 

function liri(){
    if(prog == "movie-this") {
        var movieName = process.argv[3]
        var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy";
        
        axios.get(movieUrl).then(function(response){
            if (response.data.Title == null){
                logger.info("Movie not found!")
            }

            else{
                logger.info("")
                logger.info(response.data.Title)
                logger.info("")
                logger.info("------------------")
                logger.info(response.data.Plot)
                logger.info("------------------")
                logger.info("Release Year:  " + response.data.Year)
                
                if (response.data.Ratings[0] != null) {
                    logger.info("IMDB Rating:  " + response.data.Ratings[0].Value)
                    logger.info("ROTTEN Tomatoes Rating:  " + response.data.Ratings[1].Value)
                }

                logger.info("Country of Origin:  " + response.data.Country)
                logger.info("Language:  " + response.data.Language)
                logger.info("Actors:  "+ response.data.Actors)
            }
        })
    }
    //Bands!  (Name, Venue, Date)  node liri.js concert-this <artist/band name here>

    else if(prog== "concert-this"){
        var bandName = process.argv[3]
        var bandUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp"
        axios.get(bandUrl).then(function(response){
            
            if (response.data[0].datetime == null ||
                response.data[0].venue.name == null ||
                response.data[0].venue.country == null
            ){
                logger.info("Band/Artist not found!")
            }

            else{
                for (i=0; i<response.data.length; i++){  
                    logger.info(moment(response.data[i].datetime).format("MM/DD/YYYY"))
                    logger.info("Venue:  " + response.data[i].venue.name)
                    logger.info("Location:  " + response.data[i].venue.city + ", " + response.data[i].venue.country)
                    logger.info("--------------------------")
                }
            }
        })
    }

    //Artist(s), The song's name, A preview link of the song from Spotify, The album that the song is from

    else if(prog == "spotify-this-song") {
        var songName = process.argv[3]
        spotify.search({ type: 'track', query: songName }, function(err, data) {
            if (err) {
            return logger.info("Song not found!");
            }


        logger.info("Song name:  " + data.tracks.items[0].name)
        
        for (i=0; i<data.tracks.items[0].artists.length; i++){
            logger.info("Artist" + (i + 1) + ": " + data.tracks.items[0].artists[i].name) 
        }
        logger.info("Album:  " + data.tracks.items[0].album.name)
        logger.info("Track released on:  " + data.tracks.items[0].album.release_date)
        logger.info("Preview URL:  " + data.tracks.items[0].preview_url)
        })
    }

    else if(prog == "do-what-it-says"){
        var filename = process.argv[3]
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) throw err;
            data = data.split(",")
            logger.info(data);
            prog = data[0]
            process.argv[3] = data[1]
            liri()
        });

    }

    else {
        logger.info("Invalid parameter!")
        logger.info("Liri takes the following arguments:")
        logger.info("node liri.js movie-this [movie name] -- search for movie info")
        logger.info("node liri.js concert-this [band/artist name] -- search for concert events with specified band/artist")
        logger.info("node liri.js spotify-this-song [song name] -- search spotify API for song info")
        logger.info("node liri.js do-what-it-says [filename] -- takes parameters from plaintext file (divided by commas)")
    }
}

liri()