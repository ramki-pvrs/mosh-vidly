const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const { Genre } = require('../models/genre');

const {Movie, validate} = require('../models/movie');

//get route to all movies

router.get('/', async (req, res) => {

    const movies = await Movie
     .find()
     .sort('name');

    res.send(movies);

});


//get one Movie
router.get('/:id', async(req, res) => {

    const movieObj = await Movie.findById(req.params.id);

    if(!movieObj) return res.status(404).send(`Movie with id ${req.params.id} is not present in Mongodb Movies documents`);
    
    res.send(movieObj);

});


router.post('/', async (req, res) => {
    //from the body all key-value params are retrieved and validated by Joi 
    //validate comes from models/movie.js
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //because genreId is one of the sub-doc property in Movie
    //validate it exists
    const apiBody = req.body;
    console.log(`body in movies = ${apiBody}`);
    console.log(`genreId in movies = ${apiBody.genreId}`);

    const genres = await Genre
           .find() //get all genres
           .sort('name');
    
    //console.log(`All genres = ${genres}`);

    //const genre_ids = genres.map(function(d) { return d['_id']; });

    const genre_ids = genres.map((genre) => genre['_id']);

    console.log(`All genres ids = ${genre_ids}`);

    const genre = await Genre.findById(apiBody.genreId);
    console.log(`genre in Movies = ${genre}`);
    console.log(`genre _id = ${genre._id}`);
    if(!genre) return res.status(400).send(`${req.params.genreId} does not exist`);



    //mongoose talks to the MongoDB driver and sets the object id
      //when mongoose got object id from Mongodb driver, no need to assign it to a variable and then return
    //that object id
    //so instead of let newMovie, it is const newMovie and return
    const newMovie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

  

    await newMovie.save();


    res.send(newMovie);

});

module.exports = router;



