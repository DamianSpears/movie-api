//This file creates a new endpoint for existing user authentication

   //Allows existing users to sign in
const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport'); //by requiring passport.js, we are using the LocalStrategy to make sure the user exists
require('./models');

let generateJWTToken = (user) => {
   return jwt.sign(user, jwtSecret, { //.sign is a method that encodes the information in the callback
         subject: user.Username,
         expiresIn: '7d',
         algorithm: 'HS256'
   });
}

  module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', {session: false}, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                    
                });
            }
            req.login(user, {session: false}, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token }); //this returns the token
            });
        })(req, res);
    })
}