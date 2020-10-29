const express = require("express");
const morgan = require("morgan");

const app = express();

let topTenMovies = [
  { title: "Amost Famous", director: "Cameron Crowe" },
  {
    title: "Moulin Rouge",
    director: "Baz Luhrman"
  },
  {
    title: "True Romance",
    director: "Tony Scott"
  },
  {
    title: "Empire Records",
    director: "Allan Moyle"
  },
  {
    title: "Dazed and Confused",
    director: "Richard Linklater"
  },
  {
    title: "Fellowship of the Ring",
    director: "Peter Jackson"
  },
  {
    title: "StarWars: A New Hope",
    director: "George Lucas"
  },
  {
    title: "StarWars: Empire Strikes Back",
    director: "Irvin Kershner"
  },
  {
    title: "StarWars: Return of the Jedi",
    director: "Richard Marquand"
  },
  {
    title: "Labyrinth",
    director: "Jim Henson"
  }
];

app.get("/movies", (req, res) => {
  res.json(topTenMovies);
});

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

app.use(express.static("public"));
app.use(morgan("common"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => console.log("Your app is listening on port 8080."));
