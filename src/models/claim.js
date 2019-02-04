//This is the schema for a claim. Probably will be changed around but this is a basic concept
//Claims are associated both with a specific user and a specific order

//https://gist.github.com/robertvunabandi/48d00f08bc2ba95b8eacfd879742e624

// import node modules
const mongoose = require('mongoose');

// define a schema
const ClaimModelSchema = new mongoose.Schema ({
    user_name      	: String,
    user_id			: String,
    parent			: String,
    quantity		: Number,
    legal 			: Boolean,
});	

// compile model from schema
module.exports = mongoose.model('ClaimModel', ClaimModelSchema);