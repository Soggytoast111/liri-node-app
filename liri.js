var fs = require("fs")
var dotenv = require("dotenv").config();
var axios = require("axios")
var Spotify = require("node-spotify-api")
var keys = require("./keys.js");
var moment = require("moment")

var prog = process.argv[2]
var spotify = new Spotify(keys.spotify);

function liri(){
    if(prog == "movie-this") {
        var movieName = process.argv[3]
        var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy";
        
        axios.get(movieUrl).then(function(response){
            if (response.data.Title == null){
                console.log("Movie not found!")
            }

            else{
                console.log("")
                console.log(response.data.Title)
                console.log("")
                console.log("------------------")
                console.log(response.data.Plot)
                console.log("------------------")
                console.log("Release Year:  " + response.data.Year)
                
                if (response.data.Ratings[0] != null) {
                    console.log("IMDB Rating:  " + response.data.Ratings[0].Value)
                    console.log("ROTTEN Tomatoes Rating:  " + response.data.Ratings[1].Value)
                }

                console.log("Country of Origin:  " + response.data.Country)
                console.log("Language:  " + response.data.Language)
                console.log("Actors:  "+ response.data.Actors)
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
                console.log("Band/Artist not found!")
            }

            else{
                for (i=0; i<response.data.length; i++){  
                    console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"))
                    console.log("Venue:  " + response.data[i].venue.name)
                    console.log("Location:  " + response.data[i].venue.city + ", " + response.data[i].venue.country)
                    console.log("--------------------------")
                }
            }
        })
    }

    //Artist(s), The song's name, A preview link of the song from Spotify, The album that the song is from

    else if(prog == "spotify-this-song") {
        var songName = process.argv[3]
        spotify.search({ type: 'track', query: songName }, function(err, data) {
            if (err) {
            return console.log("Song not found!");
            }


        console.log("Song name:  " + data.tracks.items[0].name)
        
        for (i=0; i<data.tracks.items[0].artists.length; i++){
            console.log("Artist" + (i + 1) + ": " + data.tracks.items[0].artists[i].name) 
        }
        console.log("Album:  " + data.tracks.items[0].album.name)
        console.log("Track released on:  " + data.tracks.items[0].album.release_date)
        console.log("Preview URL:  " + data.tracks.items[0].preview_url)
        })
    }

    else if(prog == "do-what-it-says"){
        var filename = process.argv[3]
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) throw err;
            data = data.split(",")
            console.log(data);
            prog = data[0]
            process.argv[3] = data[1]
            liri()
        });

    }

    else {
        console.log("Invalid parameter!")
        console.log("Liri takes the following arguments:")
        console.log("node liri.js movie-this [movie name] -- search for movie info")
        console.log("node liri.js concert-this [band/artist name] -- search for concert events with specified band/artist")
        console.log("node liri.js spotify-this-song [song name] -- search spotify API for song info")
        console.log("node liri.js do-what-it-says [filename] -- takes parameters from plaintext file (divided by commas)")
    }
}

liri()