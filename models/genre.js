
const mongoose = require('mongoose');
const Joi = require('joi');


//create genre schema
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

//create genre schema model
const Genre = mongoose.model('Genre', genreSchema);


function validateGenre(genre) {
    //object is key:value pairs
    //value here is about that items shape interms of type and limits
    const genre_schema = Joi.object({
        name: Joi.string().min(5).max(255).required()
    });

    return genre_schema.validate(genre);
}


module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validateGenre;

