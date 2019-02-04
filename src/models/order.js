//This is the schema for an order. Will probably still need to be modified at some point
//Claims will be handled separately, similar to comments on a story
//A claim uses an order id to know what it belongs to
//Orders use creator ids to know who started them

// import node modules

//https://gist.github.com/robertvunabandi/48d00f08bc2ba95b8eacfd879742e624


const mongoose = require('mongoose');

// define a schema
const OrderModelSchema = new mongoose.Schema ({
    item        	: String,
    link            : String,
    quantity		: Number,
    units 			: String,
    location		: String,
    creator_name	: String,
    creator_id		: String, 
    remaining		: Number,
    completed		: Boolean,
    expDate 		: String,
    startDate 		: String,
});

// compile model from schema
module.exports = mongoose.model('OrderModel', OrderModelSchema);