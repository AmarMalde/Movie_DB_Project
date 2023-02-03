var actorId = ""
var genreID = ""
var actorQuery = ""
var genreQuery = ""

var returnedData

$("#search-button").on("click", function (event) {

    event.preventDefault();

    getActorID('Mark Hamill');

});

function getActorID(actorName) {

    actorName = actorName.replaceAll(' ', '+');

    var apikey = 'api_key=e0630599deaccd5cebd57c57164e6719';
    var queryURL = 'https://api.themoviedb.org/3/search/person?' + apikey + '&query=' + actorName;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        actorId = response.results[0].id
        actorQuery = '&with_people=' + actorId

        getResponse()

    })
}

function getResponse() {

    var userGenre = $('#search-genre').val()

    findGenreID(userGenre);

    genreQuery = '&with_genres=' + genreID;

    var apikey = 'api_key=e0630599deaccd5cebd57c57164e6719';

    var queryURL = 'https://api.themoviedb.org/3/discover/movie?' + apikey + actorQuery + genreQuery + '&sort_by=popularity.desc';

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        var randomMovie = response.results[Math.floor(Math.random() * response.results.length)];

        console.log(randomMovie);

        var randomMovieTitle = randomMovie.title;

        $('#movieTitle').text(randomMovie.vote_average);

        var posterImage = "<img id='movie poster' src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + randomMovie.poster_path + "'/>";

        document.getElementById('posterImg').innerHTML = posterImage;

        $('#plot').text(randomMovie.overview);

        $('#rating').text(randomMovie.vote_average);

        getTrailer(randomMovieTitle)

    })
}

var genreArr = [
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Adventure" },
    { "id": 16, "name": "Animation" },
    { "id": 35, "name": "Comedy" },
    { "id": 80, "name": "Crime" },
    { "id": 99, "name": "Documentary" },
    { "id": 18, "name": "Drama" },
    { "id": 10751, "name": "Family" },
    { "id": 14, "name": "Fantasy" },
    { "id": 36, "name": "History" },
    { "id": 27, "name": "Horror" },
    { "id": 10402, "name": "Music" },
    { "id": 9648, "name": "Mystery" },
    { "id": 10749, "name": "Romance" },
    { "id": 878, "name": "Science Fiction" },
    { "id": 10770, "name": "TV Movie" },
    { "id": 53, "name": "Thriller" },
    { "id": 10752, "name": "War" },
    { "id": 37, "name": "Western" }
]

function findGenreID(genreName) {
    for (var i = 0; i < genreArr.length; i++) {
        if (genreArr[i].name == genreName) {
            genreID = genreArr[i].id;
            break
        }
    }

}


function getTrailer(movieTitle) {

    movieTitle = movieTitle.replaceAll(' ', ',') + ",trailer"

    var youtubeAPIKey = 'AIzaSyBXvsQQxQ5ndMrX1IeNe02xU2PWqQ60Fe8'

    var queryURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=' + movieTitle + '&type=video&key=' + youtubeAPIKey

    var youtubeLink = 'https://www.youtube.com/embed/'

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        youtubeLink = youtubeLink + (response.items[0].id.videoId)

        var trailerEmbed = '<iframe width="560" height="315" src=' + youtubeLink + ' title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';

        document.getElementById('trailer').innerHTML = trailerEmbed;

    })
}
