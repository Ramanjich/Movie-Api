const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;
const intalizeDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("yes Running");
    });
  } catch (e) {
    console.log(`DB erroe ${e.message}`);
    process.exit(1);
  }
};
intalizeDb();
// GET movies
app.get("/movies/", async (request, response) => {
  const getMovies = `SELECT * FROM movie ORDER BY movie_id;`;
  const listOfMovies = await db.all(getMovies);
  response.send(listOfMovies);
});

//Post movies

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovie = `INSERT INTO movie(director_id,movie_name,lead_actor)
    VALUES(
        ${directorId},
        '${movieName}',
        '${leadActor}'
    );`;
  await db.run(addMovie);
  response.send("Movie Successfully Added");
});

//GET one movie
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovie = `SELECT * FROM movie  WHERE movie_id=${movieId};`;
  const movieObject = await db.get(getMovie);
  const movie = {
    movieId: movieObject.movie_id,
    directorId: movieObject.director_id,
    movieName: movieObject.movie_name,
    leadActor: movieObject.lead_actor,
  };
  response.send(movie);
});

// update
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const updateDetails = request.body;
  const { directorId, movieName, leadActor } = updateDetails;
  const updateMovie = `UPDATE movie
    SET 
    director_id=${directorId},
    movie_name='${movieName}',
    lead_actor='${leadActor}'
    WHERE movie_id=${movieId};`;
  await db.run(updateMovie);
  response.send("Movie Details Updated");
});

// Delete Movie
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovie = `DELETE FROM movie WHERE movie_id=${movieId};`;
  await db.run(deleteMovie);
  response.send("Movie Removed");
});

//get directors
app.get("/directors/", async (request, response) => {
  const getDirectors = `SELECT * FROM director ORDER BY director_id;`;
  const directorsObject = await db.all(getDirectors);
  response.send(directorsObject);
});

//get unique
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getmovieD = `SELECT * FROM movie WHERE director_id=${directorId};`;
  const result = await db.all(getmovieD);
  response.send(result);
});

module.exports = app;
