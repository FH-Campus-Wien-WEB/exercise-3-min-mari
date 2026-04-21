const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

app.get('/genres', function (req, res) {
  const genres = [...new Set(
    Object.values(movieModel).flatMap(function (movie) {
      return movie.Genres;
    })
  )].sort();

  res.send(genres);
})

// Configure a 'get' endpoint for all movies..
app.get('/movies', function (req, res) {
  const genre = req.query.genre
  let movies = Object.values(movieModel)

  if (genre) {
    movies = movies.filter(function (movie) {
      return movie.Genres.includes(genre)
    })
  }

  res.send(movies)
})

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const movie = movieModel[req.params.imdbID]

  if (movie) {
    res.send(movie)
  } else {
    res.sendStatus(404)
  }
})


app.put('/movies/:imdbID', function (req, res) {
  const imdbID = req.params.imdbID
  const movieAlreadyExists = Object.prototype.hasOwnProperty.call(movieModel, imdbID)
  const movie = req.body

  movie.imdbID = imdbID
  movieModel[imdbID] = movie

  if (movieAlreadyExists) {
    res.sendStatus(200)
  } else {
    res.status(201).send(movie)
  }
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
