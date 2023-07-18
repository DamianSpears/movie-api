//This file is to configure all Passport strategies for authentication and authorization of registered users
const passport = require('passport'), //requires the passport module
   LocalStrategy = require('passport-local').Strategy,
   Models = require('./models.js'), //requiring the Schemas that were defined in the models.js
   passportJWT = require('passport-jwt'); //requires passport library for JWT authentication

let Users = Models.User,
   JWTStrategy = passportJWT.Strategy,
   ExtractJWT = passportJWT.ExtractJwt;

//These first two strtegies are in place to utilize passport for authentication by HTTP and JWT 
//'LocalStrategy' is the HTTP authentication to make sure the user exists
passport.use(new LocalStrategy({
   usernameField: 'Username',
   passwordField: 'Password' //This first step takes the username and password from the request body and uses Mongoose to check the database
}, (username, password, callback) => { //Three arguments are passed
   console.log(username + ' ' + password);
   Users.findOne({ Username: username })
   .then((user) => {
     if (!user) {
       console.log('incorrect username');
       return callback(null, false, {message: 'Incorrect username'});
     }
     console.log('finished');
     return callback(null, user);
   })
   .catch((error) => {
     console.error(error);
     return callback(error);
   })
}))

//JWTStrategy allows users to be authenticated based on JWT in request
passport.use(new JWTStrategy({
   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //extracts JWT from the HTTP request header
   secretOrKey: 'your_jwt_secret' //secret key to ensure JWT has not been altered
}, (jwtPayload, callback) => {
   return Users.findById(jwtPayload._id)
      .then((user) => {
         return callback(null, user);
      })
      .catch((error) => {
         return callback(error)
      });
}));


