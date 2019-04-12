var dotenv = require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var inquirer = require("inquirer");
var request = require("request");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");

//____________________________________________________________________________________________
// Local Variables 
var local = {
    command: "",
    artist: "",
    songName: "",
    movie: ""
}

//____________________________________________________________________________________________
// Determine what the command will be and what value will be by user-input
function ask() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Choose a command",
                choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
                name: "command"
            }
        ])
        .then(answers => {
            if (answers.command === "concert-this") {
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Enter an artist or band name",
                        name: "artist",
                        default: "Justin Timberlake"
                    }
                ])
                    .then(answers => {
                        local.command = answers.command;
                        local.artist = answers.artist;
                        checkBandsApi();
                    });
            } else if (answers.command === "spotify-this-song") {
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Enter an song name",
                        name: "songName",
                        default: "The Sign"
                    }
                ])
                    .then(answers => {
                        local.command = answers.command;
                        local.songName = answers.songName;
                        checkSpotify();
                    });
            } else if (answers.command === "movie-this") {
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Enter a movie name",
                        name: "movie",
                        default: "Mr Nobody"
                    }
                ])
                    .then(answers => {
                        local.command = answers.command;
                        local.movie = answers.movie;
                        checkOmbd();
                    });
            } else if (answers.command === "do-what-it-says") {
                readRandomFile();
            }
        })
        .catch(errors => {
            console.log(`Error occurred: ${errors}`);
        });
}
ask();

// Define each function
//___________________________________________________________________
function checkBandsApi() {
    console.log(`The artist you picked was ${local.artist}`);
    axios.get("https://rest.bandsintown.com/artists/" + local.artist.toLowerCase().replace(" ", "+") + "/events?app_id=codingbootcamp")
        .then(
            function (response) {
                for (let i = 0; i < response.data.length; i++) {
                    console.log(`\nVenue Name: ${response.data[0].venue.name}
                        \nVenue Location: ${response.data[0].venue.city}, ${response.data[0].venue.region}
                        \nDate: ${moment(response.data[0].datetime).format("MM/DD/YYYY")}`);
                    console.log("_____________________________________");
                }
                confirm();
            });
}

function checkSpotify() {
    console.log(`The song you picked was ${local.songName}`);
    spotify
        .search({ type: 'track', query: local.songName.toLowerCase().replace(" ", "+") })
        .then(function (response) {
            //   console.log(JSON.stringify(response.tracks.items.name, null, 2));
            for (let j = 0; j < response.tracks.items.length; j++) {
                console.log(`Artist: ${response.tracks.items[j].album.artists[0].name}`);
                console.log(`Song's name: ${response.tracks.items[j].name}`);
                console.log(`Album name: ${response.tracks.items[j].album.name}`);
                console.log(`Preview Link: ${response.tracks.items[j].album.artists[0].external_urls.spotify}`);
                console.log("__________________________________________________________");
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function checkOmbd() {
    console.log(`The movie you picked was ${local.movie}`);
    axios.get("http://www.omdbapi.com/?t=" + local.movie.toLowerCase().replace(" ", "+") + "&y=&plot=short&apikey=trilogy")
        .then(
            function (response) {
                // console.log(response.data);
                console.log(`\nTitle: ${response.data.Title}
                \nYear: ${response.data.Year}
                \nIMDB Rating: ${response.data.imdbRating}
                \nRotten Tomatoes Rating: ${response.data.Ratings[1].Value}
                \nCountry of production: ${response.data.Country}
                \nLanguage: ${response.data.Language}
                \nPlot: ${response.data.Plot}
                \nActors: ${response.data.Actors}`);
            }
        );
    local.movie = "";
}

function readRandomFile() {
    console.log(`Reading file in a moment...`);
    //   fs.readFile("random.txt", "utf-8", )
}

function confirm() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Would you like to start again?",
                name: "confirm",
                default: false
            }
        ])
        .then(answers => {
            console.log(answers.confirm);
            if (answers.confirm) {
                ask();
            }
            else {
                console.log("Thank you for using Liri!");
            }
        })
        .catch(errors => {
            console.log(`Error occurred: ${errors}`);
        });
}

