//initialising variables/ arrays used throughout the code and in difference functions
var actorId = "";
var genreID = "";
var actorQuery = "";
var genreQuery = "";
var favoriteMovieArr = [];

//function will empty the HTML element favorite-movies
function emptyFavMovies() {
  $("#favorite-movies").empty();
}

//function to add the array of favourite movies (stored in the local storage) to 
function showFavMovies() {
  emptyFavMovies();

  //take data from local storage
  var favoriteMovieArr = JSON.parse(localStorage.getItem("favoriteMovieArr"));

  //will only run if there was data stored in local storage
  if (favoriteMovieArr !== null) {
    for (var i = 0; i < favoriteMovieArr.length; i++) {

      //add the i element of favoriteMovieArr to a <h5>
      var movieTitleHeader = $("<h5>").text(favoriteMovieArr[i]);

      //and add the above to the HTML
      $("#favorite-movies").append(movieTitleHeader);
    }
  }
}

showFavMovies();

//clear the local storage and the HTML element showing the favourite movies
function clearFavMovies() {
  localStorage.clear();
  $("#favorite-movies").empty();
}

//when the user clicks the clear favourite button run the clearFavMovies function
$("#clearfavorites").on("click", clearFavMovies());

//executes upon the user clicking the search button
$("#search-button").on("click", function (event) {
  event.preventDefault();

  //saves the user's input in search-acotr input to a variable
  var actorInput = $("#search-acotr").val();

  getActorID(actorInput);

  //remove class from result to display the element
  $("#result").removeClass("d-none");

  //enable addFavoriteMovieButton element and add text to it
  $("#addFavoriteMovieButton").prop("disabled", false);
  $("#addFavoriteMovieButton").text("Add to Favorites!");
});

//below function will take an actor's name and return thier ID as defined by the API
function getActorID(actorName) {

  //replace spaces of parameter with commas to satisy the API's url parameters
  actorName = actorName.replaceAll(" ", "+");

  var apikey = "api_key=e0630599deaccd5cebd57c57164e6719";

  //define URL according to the API documentation and user's actor name input
  var queryURL =
    "https://api.themoviedb.org/3/search/person?" +
    apikey +
    "&query=" +
    actorName;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {

    //add the first item from the response array and use it to build the acotrQuery
    actorId = response.results[0].id;
    actorQuery = "&with_people=" + actorId;

    getResponse();
  });
}

//below function will user the genre and actor name to return a list of movies from TMDB's API
function getResponse() {

  //take the user's input to get entered genre
  var userGenre = $("#search-genre").val();

  findGenreID(userGenre);

  //use response from findGenreID() to build the query to the API. As per API documentation
  genreQuery = "&with_genres=" + genreID;

  var apikey = "api_key=e0630599deaccd5cebd57c57164e6719";

  //define URL according to the API documentation and user's input
  var queryURL =
    "https://api.themoviedb.org/3/discover/movie?" +
    apikey +
    actorQuery +
    genreQuery +
    "&sort_by=popularity.desc";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {

    //select a random item from the response array.
    var randomMovie =
      response.results[Math.floor(Math.random() * response.results.length)];

    ///////////////////////////

    //event lister for the button the user clicks on to add result to favourite movie
    $("#addFavoriteMovieButton").on("click", function (event) {

      //parse currently saved data into readable format
      var localMoviesArr = JSON.parse(localStorage.getItem("favoriteMovieArr"));

      localStorage.clear();

      //if nothing in local storage (in regards to localMoviesArr's assigment) then create an empty array 
      if (localMoviesArr === null) {
        localMoviesArr = [];
      }

      //add movie title to array
      localMoviesArr.push(randomMovie.title);

      //remove duplicates
      localMoviesArr = Array.from(new Set(localMoviesArr))

      //add array to local storage 
      localStorage.setItem("favoriteMovieArr", JSON.stringify(localMoviesArr));
      showFavMovies();
      
      //edit HTML to feedback to user 
      $("#addFavoriteMovieButton").text("Added to Favorites!");
      $("#addFavoriteMovieButton").attr("disabled", "disabled");
    });

    ///////////////////////////

    
    var randomMovieTitle = randomMovie.title;

    //add movie title, plot and rating to various HTML elements
    $("#movieTitle").text(randomMovieTitle);
    $("#plot").text(randomMovie.overview);
    $("#rating").text("This move is rated a " + randomMovie.vote_average + " out of 10");

    //define image element to eventually add to HTML
    var posterImage =
      "<img id='movie poster' src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" +
      randomMovie.poster_path +
      "'/>";

    //edit HTML to include image
    document.getElementById("posterImg").innerHTML = posterImage;


    getTrailer(randomMovieTitle);
  });
}

//array of genres and Ids as defined in API documentation
var genreArr = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

//function takes a genre name and returns the id using genreArr
function findGenreID(genreName) {
  for (var i = 0; i < genreArr.length; i++) {
    if (genreArr[i].name == genreName) {
      genreID = genreArr[i].id;
      break;
    }
  }
}

//below function uses the YouTube Data API to embed a trailer for the chosen movie
function getTrailer(movieTitle) {

  //replace spaces in title with commas, as per API documentation
  movieTitle = movieTitle.replaceAll(" ", ",") + ",trailer";

  var youtubeAPIKey = "AIzaSyBXvsQQxQ5ndMrX1IeNe02xU2PWqQ60Fe8";

  //build the query url 
  var queryURL =
    "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" +
    movieTitle +
    "&type=video&key=" +
    youtubeAPIKey;

  var youtubeLink = "https://www.youtube.com/embed/";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {

    //save the link the the trailer and combine it with the correct link to embed the video
    youtubeLink = youtubeLink + response.items[0].id.videoId;

    //below code provided by YouTube for embedding videos
    var trailerEmbed =
      '<iframe width="560" height="315" src=' +
      youtubeLink +
      ' title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';

    //update the HTML with the embedded trailer
    document.getElementById("trailer").innerHTML = trailerEmbed;
  });
}
