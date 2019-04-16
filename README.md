# liri-node-app

## Overview
LIRI is a command-line interface (CLI) that uses Node.js for the user to interact with various commands, give input, and receive data. LIRI is similar to SIRI but interprets language instead of speech. 

## Dependencies & APIs

### Dependencies
* Axios
* fs
* Inquirer
* node-spotify-api
* Moment
* DotEnv

### APIs
* OMBD
* Bands in Town
* Spotify


## Command choices
The following choices are displayed to the user using the ```inquirer``` node package. The next question is dependent on which command is chosen.

1. ```concert-this``` allows the user to input an artist or band which will be searched in the Bands in Town API to retrieve the Venue name, location, and date of when the artist or band has a concert planned. 
2. ```spotify-this-song``` allows the user to input a song name which will be searched in Spotify to retrieve the artist(s), song's name, preview link of the song from Spotify, album that the song is from.
3. ```movie-this``` allows the user to input a movie name which will be searched in the OMBD API to retrieve the title, year, IMDB rating, Rotten Tomatoes rating, country of production, language, plot and actors in the movie.
4. ```do-what-it-says``` reads a file called 'random.txt' and performs the command written in it. 




