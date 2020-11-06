const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan");

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
    title: "Amost Famous",
    director: {
      name: "Cameron Crowe",
      bio:
        "Cameron Crowe was born in Palm Springs, CA. Crowe skipped grades as a young man and began writing music reviews for 'The San Diego Door' at the age of 13. Crowe graduated from University of San Diego High School and subsequently became Rolling Stone's youngest ever contributor. Crowe's first film based on the book he wrote, Fast Times at Ridgemont High.",
      birthyear: 1957,
      deathyear: "-"
    },
    genre: "comedy-drama",
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
    genre: "musical drama",
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
    genre: "action romance",
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
    genre: "comedy drama",
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
    genre: "comedy, coming of age story",
    description:
      "It's the last day of school and it's time for the incoming freshmen to endure initiation into high school culture.",
    image: "imageURL",
    feature: true
  }
];

app.get("/movies", (req, res) => {
  res.json(movies);
});

//get movie information by title
app.get("/movies/:title", (req, res) => {
  res.json(
    movies.find(movie => {
      return movie.title === req.params.title;
    })
  );
});

//get movie genre and description by title
app.get("/movies/:title/genre", (req, res) => {
  res.send("Success getting movie genre by title");
});

//get information on director by director name
app.get("/movies/:name/director", (req, res) => {
  res.send("Success getting director data by director name.");
});

//allow user to register an account
app.post("/users", (req, res) => {
  let newUser = req.body;

  if (!newUser.userName) {
    const message = "Please provide a valid username";
    res.status(400).send(message);
  } else {
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

//allow user to update username
app.put("/user/:username", (req, res) => {
  res.send("User name successfully updated");
});

//allow user to add movie to user movie list
app.post("/user/:username/movies/:title", (req, res) => {
  res.send("movie added to movie list");
});

//allow user to delete movie from movie list
app.delete("/user/:username/movies/:title", (req, res) => {
  res.send("movie deleted from movie list.");
});

//allow user to deregister account
app.delete("/user/:username", (req, res) => {
  res.send("username successfully removed");
});

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

app.listen(8080, () => console.log("Your app is listening on port 8080."));
