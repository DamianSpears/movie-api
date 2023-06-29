const mongoose = require('mongoose');
//Imports the 'mongoose' module

//Defining the Schema below for documents in the "Movies" section
let movieSchema = mongoose.Schema({
   Title: {type: String, required : true},
      //'required: true' means each document must include the key with the specified data type
   Description: {type: String, required: true},
   Genre: {
      Style: String,
      Description: String,
   },
      //'Genre' and 'Director' include nested documents that include subdocuments of key-value pairs
   Director: {
      Name: String,
   },
   Actors: [String],
      //Above states that 'Actors' will include an array of strings
   Featured: Boolean,
});
//The defined Schema has a series of keys and values that anticipate data related from the "movies" collection
//Values can be string, number, boolean, date, etc.


//Defining the Schema below for documents in the "Users" section
let userSchema= mongoose.Schema({
   Username: {type: String, required: true},
   Password: {type: String, required: true},
   Email: {type: String, required: true},
   Birthday: Date,
   FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
      //FavoriteMovies states there is a different collection to reference
});
//The defined Schema has a series of keys and values that anticipate data related from the "users" collection


let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
//These create models that then use the Schemas that were defined above

module.exports.Movie = Movie;
module.exports.User = User;
//'module.exports' allows these Mongoose packages to be exported in order to be used in the index.js file
