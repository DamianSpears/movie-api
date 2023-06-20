let express = require('express'),
   //ONLY imports the express module into the js file
   app = express(),
   //declares a variable that calls Express' functionality to configure the web server
   morgan = require('morgan'),
   bodyParser = require('body-parser'),
   uuid = require('uuid');

app.use(bodyParser.json());

let users = [
   {
      id: 1234,
      name: 'Damian',
      email: 'example@me.com',
      movies: {
         title: 'Tenet',
         director: 'Christopher Nolan',
         genre: {
            style: 'Action',
            description: 'fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts.'
         }
      },
   }
];

let topMovies = [
   {
      title: 'Tenet',
      director: 'Christopher Nolan',
      genre: {
         style: 'Action',
         description: 'fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts.'
      }
   },
   {
      title: 'Inception',
      director: 'Chrisopher Nolan',
      genre: {
         style: 'Action',
         description: 'fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts.'
      }
   },
   {
      title: 'Reservoir Dogs',
      director: 'Quentin Tarantino',
      genre: {
         style: 'Crime',
         description: 'Most crime drama focuses on crime investigation and does not feature the courtroom. Suspense and mystery are key elements that are nearly ubiquitous to the genre.'
      }
   },
   {
      title: 'Django Unchained',
      director: 'Quentin Tarantino',
      genre: {
         style: 'Western',
         description: 'Movies that are set in the American West, usually in the period from the 1850s to the end of the 19th century.'
      }
   },
   {
      title: 'The Grand Budapest Hotel',
      director: 'Wes Anderson',
      genre: {
         style: 'Drama',
         description: 'Stories with high stakes and many conflicts. They are plot-driven and demand that every character and scene move the story forward.'
      }
   },
   {
      title: 'Pulp Fiction',
      director: 'Quentin Tarantino',
      genre: {
         style: 'Comedy',
         description: 'Films designed to elicit laughter from the audience. Comedies are light-hearted dramas, crafted to amuse, entertain, and provoke enjoyment'
      }
   },
   {
      title: 'Mad MAx: Fury Road',
      director: 'George Miller',
      genre: {
         style: 'Science Fiction',
         description: 'genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life'
      }
   },
   {
      title: 'Inception',
      director: 'Christopher Nolan',
      genre: {
         style: 'Science Fiction',
         description: 'Speculative films, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life'
      }
   },
   {
      title: 'Goodfellas',
      director: 'Martin Scorsese',
      genre: {
         style:'Crime',
         description: 'Most crime drama focuses on crime investigation and does not feature the courtroom. Suspense and mystery are key elements that are nearly ubiquitous to the genre.'
      }
   },
   {
      title: 'Shutter Island',
      director: 'Shutter Island',
      genre: {
         style: 'Thriller',
         description: 'Thrillers are characterized and defined by the moods they elicit, giving their audiences heightened feelings of suspense, excitement, surprise, anticipation and anxiety.'
      }
   }
];

app.use(morgan('common'));
//utilizes morgan to log information to the terminal.


//Welcome with the home route
app.get('/', (req, res) => {
   res.send('Welcome to the Movie API app');
});

//1.  Return list of all movies
app.get('/movies', (req, res) => {
   res.json(topMovies);
});

//2.  Return data about a single movie by title
app.get('/movies/:title', (req, res) => {
   res.json(topMovies.find((movie) => {
      return movie.title === req.params.title}))
   });
//^ The .find is looping through the topMovies array and will only return the instance that matches the request parameters ()

//3.  Return data about a genre by style
app.get('movies/genre/:style', (req, res) => {
   let movie = topMovies.find((movie) => {
      return movie.genre === req.params.genre})
   if (movie) {
      res.status(201).send(req.params.genre)
   }});
//^ The find loop uses an 'if' statement in order to return both the style and description under the 'genre' property
//If I did not include an 'if' statement, the function would only return the style, and not both properties under 'genre'

//4.  Return data about a director by name
app.get('/movies/:director', (req, res) => {
   res.send('Successful GET request returning data about a director')});
//^Remember, request parameters in the return statement must match the defined URL endpoint

//5.  Allow users to register
app.post('/users', (req, res) => {
   res.send('Successful POST request allowing users to enter information in a JSON format')});

//6.  Allow users to update info
app.put('/users/:name/:email', (req, res) => {
   let user = users.find((user) => { return user.name === req.params.name})
   //First, we are verifying the user to make sure they exist
   if (user) {
      user.email = req.params.email;
      res.status(201).send('New email = ' + req.params.email);
   } else {
      res.status(404).send('Error');
   }
});

//7.  Allow users to add a movie to their favorites
app.post('/users/:name/movies', (req, res) => {
   res.send('Successful POST request that adds a JSON object to the movie property under the defined user.')
});

//8.  Allow users to remove a movie from their favorites
app.delete('/users/:name/movies/:title', (req, res) => {
   res.send('Successful DELETE request that removes a JSON object defined by the title property within it')
});

//9.  Allow existing users to deregister
app.delete('/users/:name', (req, res) => {
   res.send('Successful DELETE request that removes a user from the users array')
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