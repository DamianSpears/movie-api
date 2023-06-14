let express = require('express'),
   //ONLY imports the express module into the js file
   app = express(),
   //declares a variable that calls Express' functionality to configure the web server
   morgan = require('morgan');
let topMovies = [
   {
      title: 'Tenet',
      director: 'Christopher Nolan'
   },
   {
      title: 'Inception',
      director: 'Chrisopher Nolan'
   },
   {
      title: 'Reservoir Dogs',
      director: 'Quentin Tarantino',
   },
   {
      title: 'Django Unchained',
      director: 'Quentin Tarantino',
   },
   {
      title: 'The Grand Budapest Hotel',
      director: 'Wes Anderson',
   },
];
//This is the JSON, which I would like to move to a local file outside of index.js

app.use(morgan('common'));
//utilizes morgan to log information to the terminal.
//would like to log ot log.txt as well

app.get('/', (req, res) => {
   res.send('Welcome to the Movie API app');
});

app.get('/movies', (req, res) => {
   res.json(topMovies);
});

app.use(express.static('public'));
//since documentation.html is only file, this will load the public folder and display documentation.html.
//will also load other files within that folder?

app.use((err, req, res, next) => {
   console.log(err.stack);
   res.status(500).send('An error has occured');
});

app.listen(8080, () => {
   console.log('Your app is listening on port 8080.');
});