require('dotenv').config();

const express = require('express'),//ONLY imports the express module into the js file
   bodyParser = require('body-parser'),
   uuid = require('uuid'),
   morgan = require('morgan'),
   fs = require('fs'),
   path = require('path');
const app = express();//declares a variable that calls Express' functionality to configure the web server
const mongoose = require('mongoose');
//const Models = require('./models.js');

//const Movies = Models.Movie;
//const Users = Models.User;

//const { check, validationResult } = require('express-validator'); //allows for input validation on POST and PUT requests
const cors = require('cors');
app.use(cors());

//mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true }); //links external database to index.js files using Mongoose
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//process.env.[variable] is a variable defined in heroku to link these API files to the MongoDB Atlas remote database


app.use(bodyParser.json());

let auth = require('./auth')(app); //using the 'app' arguement ensures Express is available in auth.js
const passport = require('passport');
require('./passport.js'); //Passport is used in order to apply jwt.authenticate to the URL endpoints for authentication on certain requests

app.use(morgan('common'));
//utilizes morgan to log information to the terminal.

//Welcome with the home route
app.get('/', (req, res) => {
   res.send('Welcome to the Movie API app');
});

app.use(express.static('public'));
//since documentation.html is only file, this will load the public folder and display documentation.html.
//will also load other files within that folder?

app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).send('An error has occured');
});


app.listen(process.env.PORT || 8080, '0.0.0.0', () => {
  console.log(`Listening on Port ` + port);
});