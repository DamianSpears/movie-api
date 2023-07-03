const mongoose = require('mongoose');
//Imports the 'mongoose' module

//Defining the Schema below for documents in the "Movies" section
let movieSchema = mongoose.Schema({
   Title: {type: String, required : true},
      //'required: true' means each document must include the key with the specified data type
   Director: {type: String},
   Genre: [ {
      Style: String,
      Description: String,
   } ],
      //'Genre' includes nested documents that include subdocuments of key-value pairs
});
//The defined Schema has a series of keys and values that anticipate data related from the "movies" collection
//Values can be string, number, boolean, date, etc.


//Defining the Schema below for documents in the "Users" section
let userSchema= mongoose.Schema({
   username: {type: String, required: true},
   password: {type: String, required: true},
   birthday: Date,
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
