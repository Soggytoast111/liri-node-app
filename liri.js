var dotenv = require("dotenv").config();
var axios = require("axios")

var prog = process.argv[2]

//var spotify = new Spotify(keys.spotify);



//Movies! -- Command node liri.js movie-this '<movie name here>'



if(prog == "movie-this") {
    var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy";
    var movieName = process.argv[3]
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

if(prog== "concert-this"){
    var bandName = process.argv[3]
    var bandUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp"
    axios.get(bandUrl).then(function(response){
    for (i=0; i<=response.length; i++){
        console.log(response[i].datetime)
        console.log(response[i].)
    }

        
    })


}
