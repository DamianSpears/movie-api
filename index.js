require('dotenv').config();

const express = require('express'),//ONLY imports the express module into the js file
   bodyParser = require('body-parser'),
   uuid = require('uuid'),
   morgan = require('morgan'),
   fs = require('fs'),
   path = require('path');
const app = express();//declares a variable that calls Express' functionality to configure the web server
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;


const cors = require('cors');
app.use(cors());

//mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true }); //links external database to index.js files using Mongoose
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//process.env.[variable] is a variable defined in heroku to link these API files to the MongoDB Atlas remote database

app.use(bodyParser.json());

const { check, validationResult } = require('express-validator'); //allows for input validation on POST and PUT requests
let auth = require('./auth')(app); //using the 'app' arguement ensures Express is available in auth.js
const passport = require('passport');
require('./passport.js'); //Passport is used in order to apply jwt.authenticate to the URL endpoints for authentication on certain requests

app.use(morgan('common'));
//utilizes morgan to log information to the terminal.

//Welcome with the home route
app.get('/', (req, res) => {
   res.send('Welcome to the Movie API app');
});

//These are a series of middleware functions that occur between the HTTP request and response
//1.  Return list of all movies
app.get('/movies', (req, res) => {
   Movies.find()
      .then((movies) => {
         res.status(201).json(movies);
      })
      .catch((err) => {
         console.error(err);
         res.status(500).send('Error' + err)
      })
});

//2.  Return data about a single movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
   Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
         res.status(200).json(movie)
      })
      .catch((err) => {
         res.status(500).send('Error ' + err)
      })
});
//^ The .find is looping through the topMovies array and will only return the instance that matches the request parameters ()

//3.  Return data about a genre by style
app.get('/movies/Genre/:Style', passport.authenticate('jwt', { session: false }), (req, res) => {
   Movies.find({ 'Genre.Style': req.params.Style })
      .then((movie) => {
         if (movie.length == 0) {
            res.status(404).send('Error')
         } else {
            res.status(200).json(movie)
         }
      })
      .catch((err) => {
         console.error(err);
         res.status(500).send('Error: ' + err)
      });
});
//^ The find loop uses an 'if' statement in order to return both the style and description under the 'genre' property
//If I did not include an 'if' statement, the function would only return the style, and not both properties under 'genre'

//4.  Return data about a director by name
app.get('/movies/:director', passport.authenticate('jwt', { session: false }), (req, res) => {
   Movies.find({ Director: req.params.director })
      .then((director) => {
         if (director) {
            res.status(200).json(director)
         } else {
            res.status(404).send('Error')
         }
      })
      .catch((err) => {
         console.error(err);
         res.status(500).send('Error: ' + err)
      });
});
//^Remember, request parameters in the return statement must match the defined URL endpoint

//5.  Uses an HTTP request to collect info, populate the 'user' document, and hashes passwords in order to keep secure when storing in the non-relational database
app.post('/users',
   [
      check('Username', 'Username is required').isLength({ min: 5 }), //The layout is the input field, then error, then requirements
      check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
      check('Email', 'Email does not appear to be valid').isEmail()
   ]
   , (req, res) => {
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
         return res.status(422).json({ errors: errors.array() }); //If any error occurs, this function sends a JSON object in an HTTP response
      }

      let hashedPassword = Users.hashPassword(req.body.Password); //This is taking the password from the request body and hasing it to use in the Users section of the 'then' method below
      Users.findOne({ Username: req.body.Username }) //findOne searches to make sure username does not already exist in the "users" model
         .then((user) => {
            if (user) {
               return res.status(400).send(req.body.Username + 'already exists'); //If it exists, returns 400 error
            } else { //If it does not, we create a new user with the information provided in the request body
               Users.create({
                  Username: req.body.Username,
                  Password: hashedPassword,
                  Email: req.body.Email,
                  Birthday: req.body.Birthday
               }) // '.create' is a mongoose command that takes a JSON object and executes on the specified MongoDB model
                  //in this case, it is the 'user' schema
                  .then((user) => {
                     res.status(200).json(user)
                  }) //response status and JSON document are then sent back to the client
                  .catch((error) => {
                     console.error(error);
                     res.status(500).send('Error: ' + error);
                  });
            }
         }).catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
         });
   });

//6.  Allow users to update info
app.put('/users/:Username',
   [
      check('Username', 'Username is required').isLength({ min: 5 }), //The layout is the input field, then error, then requirements
      check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
      check('Email', 'Email does not appear to be valid').isEmail(),
   ],
   passport.authenticate('jwt', { session: false }), (req, res) => {
      Users.findOneAndUpdate({ Username: req.params.Username }, {
         $set:
         {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
         }
      },
         { new: true }) //makes sure updated document is returned in next parameter
         .then(updatedUser => {
            res.json(updatedUser);
         })
         .catch(err => {
            console.error(err)
            res.status(500).send('Error: ' + err);
         });
   });

//7.  Allow users to add a movie to their favorites
app.post('/users/:username/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
   Users.findOneAndUpdate(
      { Username: req.params.username },
      { $push: { FavoriteMovies: req.params.title } },
      { new: true })
      .then(updatedUser => {
         res.json(updatedUser);
      })
      .catch(err => {
         console.error(err);
         res.status(500).send('Error: ' + err);
      })
});

//8.  Allow users to remove a movie from their favorites
app.delete('/users/:username/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
   Users.findOneAndUpdate(
      { Username: req.params.username },
      { $pull: { favoriteMovies: req.params.title } },  //<-- Uses '$pull' function to remove a new movie ID to the end of the FavoriteMovies array
      { new: true })
      .then(updatedUser => {
         res.json(updatedUser);
      })
      .catch(err => {
         console.error(err);
         res.status(500).send('Error: ' + err);
      });
});


//9.  Allow existing users to deregister
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
   Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
         if (!user) {
            res.status(400).send(req.params.Username + ' was not found');
         } else {
            res.status(200).send(req.params.Username + ' was deleted.');
         }
      })
      .catch((err) => {
         console.error(err);
         res.status(500).send('Error: ' + err);
      })
});

//    Return a list of all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
   Users.find()
      .then((users) => {
         res.status(201).json(users)
      })
      .catch((error) => {
         console.error(err);
         res.status(500).send('Error' + error);
      });
})

//    Return a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
   Users.findOne({ Username: req.params.Username })
      .then((user) => {
         res.json(user);
      })
      .catch((error) => {
         console.error(err);
         res.status(500).send('Error: ' + err);
      });
});

// Update movie information
app.put('/movies/:Title',
   (req, res) => {
      Users.findOneAndUpdate({ Title: req.params.Title }, {
         $set:
         {
            Title: req.body.Title,
            Director: req.body.Director,
            Description: req.body.Description,
            Image: req.body.Image,
            Genre: {
               Style: req.body.Genre.Style,
               Description: req.body.Genre.Description
            }
         }
      },
         { new: true }) //makes sure updated document is returned in next parameter
         .then(updatedMovie => {
            res.json(updatedMovie);
         })
         .catch(err => {
            console.error(err)
            res.status(500).send('Error: ' + err);
         });
   });

// Add a new movie to the list
app.post('/movies'
   , (req, res) => {
      Movies.findOne({ Title: req.body.Title }) //findOne searches to make sure username does not already exist in the "users" model
         .then((movie) => {
            if (movie) {
               return res.status(400).send(req.body.Title + 'already exists'); //If it exists, returns 400 error
            } else { //If it does not, we create a new user with the information provided in the request body
               Movies.create({
                  Title: req.body.Title,
                  Director: req.body.Director,
                  Description: req.body.Description,
                  Image: req.body.Image,
                  Genre: {
                     Style: req.body.Genre.Style,
                     Description: req.body.Genre.Description
                  }
               }) // '.create' is a mongoose command that takes a JSON object and executes on the specified MongoDB model
                  //in this case, it is the 'user' schema
                  .then((movie) => {
                     res.status(200).json(movie)
                  }) //response status and JSON document are then sent back to the client
                  .catch((error) => {
                     console.error(error);
                     res.status(500).send('Error: ' + error);
                  });
            }
         }).catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
         });
   });

app.use(express.static('public'));
//since documentation.html is only file, this will load the public folder and display documentation.html.
//will also load other files within that folder?

app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).send('An error has occured');
});

const port = process.env.PORT || 8080
app.listen(port, '0.0.0.0', () => {
   console.log(`Listening on Port ` + port);
});