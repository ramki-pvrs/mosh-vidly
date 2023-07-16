const Joi = require('joi');
const mongoose = require('mongoose');


//create the schema and use it to create the model
//in a model like rental, you will not need all attributes of customer or movies
//they may have 10s of attributes
//in rental model, you only need sub-set of customer or movie attributes for quick ref
//anything more, may be you can have their ids 
//and query the back-end for respective models for all data

//Ramki: I am creating separate schema objects and adding them in rentalSchema

const customerSchemaSubset = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 15
    }
});

const movieSchemaSubset = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
});

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchemaSubset,
        required: true
    },
    movie: {
        type: movieSchemaSubset,
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

/*
404 Not Found
<pre>Cannot POST /api/rentals</pre>
the above error means, after you have coded model and route, add it to index.js




*/

//Joi validation for incoming api url params (not model validation by mongoose)
function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });



    return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;