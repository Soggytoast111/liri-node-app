require("dotenv").config();

var spotify = new Spotify(keys.spotify);

var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";