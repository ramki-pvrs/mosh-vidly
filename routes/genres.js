const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const {Genre, validate} = require('../models/genre');

/*
const genres = [
    {id:1, name:"Comedy"},
    {id:2, name:"Action"},
    {id:3, name:"Thriller"}
];
*/

router.get('/', async (req, res) => {
    const genres = await Genre
           .find() //get all genres
           .sort('name');
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    //const genreObj = genres.find(g => g.id === parseInt(req.params.id));

    const genreObj = await Genre.findById(req.params.id);
    if(!genreObj) return res.status(404).send("Genre with given id not found");
    res.send(genreObj);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    //if(error) return res.status(400).send("Genre name is required with minimum length of 5 characters and maximum 255.");
    if(error) return res.status(400).send(error.details[0].message);


    const apiParams = req.params;
    console.log(`params in genres = ${apiParams.name}`);

    const apiBody = req.body;
    console.log(`body in genres = ${apiBody.name}`);
   
    /*
    const newGenre = {
        id: genres.length + 1,
        name: req.body.name
    };
    */
   //observe let newGenre is used instead of const newGenre
   //so that the awaited result
   //can be assigned to the same var name
   let newGenre = new Genre({
    name: req.body.name

   });

    //genres.push(newGenre);
    newGenre = await newGenre.save();
    //console.log(genres);

    res.send(newGenre);
});


//http://192.168.0.102:3010/api/genres/643a317deae078891e03564e
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    //if(error) return res.status(400).send("Genre name is required with minimum length of 5 characters and maximum 255.");
    if(error) return res.status(400).send(error.details[0].message);



    const genreObj = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
        new: true
    });

    //const genreObj = genres.find(g => g.id === parseInt(req.params.id));
    //console.log(`put genreObj ${genreObj}`);
    if(!genreObj) return res.status(404).send("Genre with given id not found, so no update!");

    
    //genreObj.name = req.body.name
    //console.log(genres);

    res.send(genreObj);
});

router.delete('/:id', async (req, res) => {
    const genreObj = await Genre.findByIdAndRemove(req.params.id);

    if(!genreObj) return res.status(404).send("Genre with given id not found, so no update!");

    res.send(genreObj);
});








module.exports = router;
