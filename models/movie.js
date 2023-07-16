const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');

const Movie = mongoose.model('Movies', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  genre: { 
    type: genreSchema,  
    required: true
  },
  numberInStock: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255
  },
  dailyRentalRate: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255
  }
}));

/*
movies POST req in Postman

http://192.168.0.111:3010/api/movies -- change the IP Address 

{
    "title":"Ramki The Great",
    "genreId": "643e05807d099e1cb1347ae5",
    "numberInStock": 10,
    "dailyRentalRate": 10
}

*/

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
  });

  return schema.validate(movie);
}

exports.Movie = Movie; 
exports.validate = validateMovie;