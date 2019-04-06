js
require("dotenv").config();

var keys = require("./keys.js");

var spotify = new spotify(keys.spotify);

//need fs to read the random.txt file and do that command

//concert-this: searches Bands in Town Artist Events API
//"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
// * Name of the venue

// * Venue location

// * Date of the Event (use moment to format this as "MM/DD/YYYY")