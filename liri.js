var dotenv = require("dotenv").config();
var axios = require("axios")
var Spotify = require("node-spotify-api")
var keys = require("./keys.js");

var prog = process.argv[2]
var spotify = new Spotify(keys.spotify);


if(prog == "movie-this") {
    var movieName = process.argv[3]
    var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy";
    
    axios.get(movieUrl).then(function(response){
        
        console.log("")
        console.log(response.data.Title)
        console.log("")
        console.log("------------------")
        console.log(response.data.Plot)
        console.log("------------------")
        console.log("Release Year:  " + response.data.Year)
        console.log("IMDB Rating:  " + response.data.Ratings[0].Value)
        console.log("ROTTEN Tomatoes Rating:  " + response.data.Ratings[1].Value)
        console.log("Country of Origin:  " + response.data.Country)
        console.log("Language:  " + response.data.Language)
        console.log("Actors:  "+ response.data.Actors)
    })
}
//Bands!  (Name, Venue, Date)  node liri.js concert-this <artist/band name here>

else if(prog== "concert-this"){
    var bandName = process.argv[3]
    var bandUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp"
    axios.get(bandUrl).then(function(response){
        
    for (i=0; i<response.data.length; i++){
        console.log(response.data[i].datetime)
        console.log("Venue:  " + response.data[i].venue.name)
        console.log("Location:  " + response.data[i].venue.city + ", " + response.data[i].venue.country)
        console.log("--------------------------")
    }
    })
}

//Artist(s), The song's name, A preview link of the song from Spotify, The album that the song is from

else if(prog == "spotify-this-song") {
    var songName = process.argv[3]
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
    
      console.log(data.tracks.items); 
      
    })
}
