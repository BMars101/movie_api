const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

app.get("/movies", (req, res) => {
  Movies.find()
    .then(movies => {
      res.status(201).json(movies);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//get movie information by title
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then(movie => {
      res.status(201).json(movie);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//get movie genre and description by title
app.get("/movies/genre/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then(movie => {
      res.status(201).json({
        Genre: movie.genre.name,
        Description: movie.genre.description
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//get information on director by director name
app.get("/movies/director/:name", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.name })
    .then(movie => {
      console.log(movie);
      res.status(201).json({
        Name: movie.director.name,
        Bio: movie.director.bio,
        Birth: movie.director.birth,
        Death: movie.director.death
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//allow user to register an account
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.username })
    .then(user => {
      if (user) {
        return res.status(400).send(req.body.username + " already exists");
      } else {
        Users.create({
          Username: req.body.username,
          Password: req.body.password,
          Email: req.body.email,
          Birthday: req.body.birthday
        })
          .then(user => {
            res.status(201).json(user);
          })
          .catch(error => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//Get all users
app.get("/users", (req, res) => {
  Users.find()
    .then(users => {
      res.status(201).json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Get user by username
app.get("/users/:username", (req, res) => {
  Users.findOne({ Username: req.params.username })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//allow user to update username
app.put("/users/:username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $set: {
        Username: req.body.username,
        Password: req.body.password,
        Email: req.body.email,
        Birthday: req.body.birthday
      }
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//allow user to add movie to user movie list
app.post("/users/:username/movies/:movieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $push: { FavoriteMovies: req.params.movieID }
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//allow user to delete movie from movie list
app.delete("/users/:username/movies/:movieID", (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.username }),
    {
      $pull: { FavoriteMovies: req.params.movieID }
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    };
});

//allow user to deregister account
app.delete("/users/:username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.username })
    .then(user => {
      if (!user) {
        res.status(400).send(req.params.username + " was not found");
      } else {
        res.status(200).send(req.params.username + " was deleted.");
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => console.log("Your app is listening on port 8080."));
