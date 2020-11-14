const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  Models = require("./models.js");
(Movies = Models.Movie), (Users = Models.User);

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(morgan("common"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

let movies = [
  {
    title: "Almost Famous",
    director: {
      name: "Cameron Crowe",
      bio:
        "Cameron Crowe was born in Palm Springs, CA. Crowe skipped grades as a young man and began writing music reviews for 'The San Diego Door' at the age of 13. Crowe graduated from University of San Diego High School and subsequently became Rolling Stone's youngest ever contributor. Crowe's first film based on the book he wrote, Fast Times at Ridgemont High.",
      birthyear: 1957,
      deathyear: "-"
    },
    genre: "drama",
    description:
      "Almost famous is a semi-biographical film based on the life of director Cameron Crowe detailing his path to becoming a writer for Rolling Stone Magazine.",
    image: "imageURL",
    feature: true
  },
  {
    title: "Moulin Rouge",
    director: {
      name: "Baz Luhrmann",
      bio:
        "Baz Luhrmann is an Australian director who also has numerous other accomplishments such as being a writer and producer",
      birthyear: 1962,
      deathyear: "-"
    },
    genre: "musical",
    description:
      "Moulin Rouge is a musical drama based on the Paris cabaret in the late 19th and early 20th centuries. Moulin Rouge chronicles the love story between a poor writer and a high class courtesan",
    image: "imgURL",
    feature: true
  },
  {
    title: "True Romance",
    director: {
      name: "Tony Scott",
      bio:
        "Tony Scott was an English film director and producer.  His other notable works include Man on Fire, Enemy of the State and Unstoppable.",
      birthyear: 1944,
      deathyear: 2012
    },
    genre: "action",
    description:
      "Two unassuming lovers cross paths after Clarence Worley's co-worker sends a callgirl to meet him in a movie theater. Danger and adventure ensue.",
    image: "imageURL",
    feature: true
  },
  {
    title: "Empire Records",
    director: {
      name: "Allan Moyle",
      bio:
        "Allan Moyle was born in the Quebec province of Canada. His other notable film is Pump Up the Volume.",
      birthyear: 1947,
      deathyear: "-"
    },
    genre: "drama",
    description:
      "teenagers working at a record store save the day after a co-worker blows all the store's money gambling.",
    image: "imageURL",
    feature: true
  },
  {
    title: "Dazed and Confused",
    director: {
      name: "Richard Linklater",
      bio:
        "Richard Linklater is a film director and producer whose works typically focus on suburban culture and the passage of time.",
      birthyear: 1960,
      deathyear: "-"
    },
    genre: "comedy",
    description:
      "It's the last day of school and it's time for the incoming freshmen to endure initiation into high school culture.",
    image: "imageURL",
    feature: true
  }
];

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
/*res.json(movies);
});*/

//get movie information by title
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then(movie => {
      res.json(movie);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
/*res.json(
    movies.find(movie => {
      return movie.title === req.params.title;
    })
  );
});*/

//get movie genre and description by title
app.get("/movies/:title/genre", (req, res) => {
  res.json(
    movies.find(movie => {
      return movie.director === req.params.director;
    })
  );
  res.send("Success getting movie genre by title");
});

//get information on director by director name
app.get("/movies/:name/director", (req, res) => {
  res.send("Success getting director data by director name.");
});

//initialize user object array.
let users = [];

//allow user to register an account
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then(user => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
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
app.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//allow user to update username
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
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
app.post("/users/:username/movies/:title", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.title }
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
app.delete("/users/:username/movies/:title", (req, res) => {
  res.send("movie deleted from movie list.");
});

//allow user to deregister account
app.delete("/users/:username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then(user => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/*res.send("username successfully removed");
});*/

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

app.listen(8080, () => console.log("Your app is listening on port 8080."));
