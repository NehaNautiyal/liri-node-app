require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var inquirer = require("inquirer");
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
                local.command = answers.command;
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Enter an artist or band name",
                        name: "artist",
                        default: "Justin Timberlake"
                    }
                ])
                    .then(answers => {
                        local.artist = answers.artist;
                        logInfo(local.command + " " + local.artist);
                        checkBandsApi();
                    });
            } else if (answers.command === "spotify-this-song") {
                local.command = answers.command;
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Enter an song name",
                        name: "songName",
                        default: "The Sign"
                    }
                ])
                    .then(answers => {
                        local.songName = answers.songName;
                        logInfo(local.command + " " + local.songName);
                        checkSpotify();
                    });
            } else if (answers.command === "movie-this") {
                local.command = answers.command;
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Enter a movie name",
                        name: "movie",
                        default: "Mr Nobody"
                    }
                ])
                    .then(answers => {
                        local.movie = answers.movie;
                        logInfo(local.command + " " + local.movie);
                        checkOmbd();
                    });
            } else if (answers.command === "do-what-it-says") {
                local.command = answers.command;
                logInfo(local.command);
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
    // console.log(`\nThe artist you picked was ${local.artist}`);
    axios.get("https://rest.bandsintown.com/artists/" + local.artist.toLowerCase().replace(" ", "+") + "/events?app_id=codingbootcamp")
        .then(
            function (response) {
                if (response.data.length === 0) {
                    console.log(`${local.artist} has no concerts found in the near future.`);
                } else {
                    for (let i = 0; i < response.data.length; i++) {
                        console.log(`Venue Name: ${response.data[i].venue.name}`);
                        console.log(`Venue Location: ${response.data[i].venue.city}, ${response.data[i].venue.region}`);
                        console.log(`Date: ${moment(response.data[i].datetime).format("MM/DD/YYYY")}`);
                        console.log("_____________________________________");
                    }
                }
                confirm();
                local.artist = "";
            })
        .catch(function (error) {
            console.log(error.message);
        });
}

function checkSpotify() {
    // console.log(`\nThe song you picked was ${local.songName}`);
    spotify
        .search({ type: 'track', query: local.songName.toLowerCase().replace(" ", "+") })
        .then(function (response) {
            if (response.tracks.items.length === 0) {
                console.log(`No results found for your search of ${local.songName}`);
            } else {
                for (let j = 0; j < response.tracks.items.length; j++) {
                    console.log(`Artist: ${response.tracks.items[j].album.artists[0].name}`);
                    console.log(`Song's name: ${response.tracks.items[j].name}`);
                    console.log(`Album name: ${response.tracks.items[j].album.name}`);
                    console.log(`Preview Link: ${response.tracks.items[j].album.artists[0].external_urls.spotify}`);
                    console.log("__________________________________________________________");
                }
            }
            confirm();
            local.songName = "";
        })
        .catch(function (err) {
            console.log(err);
        });
}

function checkOmbd() {
    // console.log(`The movie you picked was ${local.movie}`);
    axios.get("http://www.omdbapi.com/?t=" + local.movie.toLowerCase().replace(" ", "+") + "&y=&plot=short&apikey=trilogy")
        .then(
            function (response) {
                if (!response.data.Title) {
                    console.log(`No results found for your search of ${local.movie}`);
                } else {
                    console.log(`\nTitle: ${response.data.Title}`);
                    console.log(`Year: ${response.data.Year}`);
                    console.log(`IMDB Rating: ${response.data.imdbRating}`);
                    console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
                    console.log(`Country of production: ${response.data.Country}`);
                    console.log(`Language: ${response.data.Language}`);
                    console.log(`Plot: ${response.data.Plot}`);
                    console.log(`Actors: ${response.data.Actors}`);
                }
                confirm();
                local.movie = "";
            })
        .catch(function (error) {
            console.log(error.message);
        });
}

function readRandomFile() {
    console.log(`Reading file...`);
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(`Error occurred: ${error}`);
        }
        var newData = data.split(","); //an array
        local.command = newData[0];

        if (local.command === "concert-this") {
            local.artist = newData[1];
            checkBandsApi();
        } else if (local.command === "spotify-this-song") {
            local.songName = newData[1];
            checkSpotify();
        } else if (local.command === "movie-this") {
            local.movie = newData[1];
            checkOmbd();
        }
    });
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

function logInfo(info) {
    fs.appendFile("log.txt", info + "\n", function (err) {
        if (err) {
            return console.log(err);
        }

        console.log(`\nYour search has been logged.\n`);
    });
}

