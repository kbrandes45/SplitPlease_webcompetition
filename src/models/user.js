//This is the schema for a user. At the moment it's just a rough draft we need to finish it!
//So basically most of the stuff will be associated with a user _id, like orders and claims

//https://gist.github.com/robertvunabandi/48d00f08bc2ba95b8eacfd879742e624

// import node modules
const mongoose = require('mongoose');

// define a schema
const UserModelSchema = new mongoose.Schema ({
    name        	: String,
    mitid			: String,
    location		: String,
    email			: String
});

// compile model from schema
module.exports = mongoose.model('UserModel', UserModelSchema);