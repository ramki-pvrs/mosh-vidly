const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie'); 
const {Customer} = require('../models/customer'); 
const mongoose = require('mongoose');
const Fawn = require('fawn'); //class and for two phase commit to mongo
const express = require('express');
const router = express.Router();


//Fawn.init(mongoose) /err  "the provided mongoose instance is invalid"
//https://forum.codewithmosh.com/t/transaction-problem-with-fawn-package/7405/3
//I used:
//Fawn.init(“mongodb://127.0.0.1:27017/yourdbnamehere”);


//EXPLORE https://stackoverflow.com/questions/75398509/why-does-fawn-throwing-an-error-like-the-provided-mongoose-instance-is-invalid



//https://mongoosejs.com/docs/transactions.html
//Fawn is not maintained much
//Fawn.init("mongodb://ramkinode:ramkinode@cluster0.qoqsp.mongodb.net/vidly?retryWrites=true&w=majority");

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

/*
POST req in postman

http://192.168.0.111:3010/api/rentals

{
    "customerId":"6444a305f2b888bab397d89c",
    "movieId": "644499830689fe5e374c86e6"
}

*/

router.post('/', async (req, res) => {
  console.log("Inside rentals POST");
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  //two saves; nw may fail
  //advanced topic - two phase commit in Mongo- need to explore
  rental = await rental.save();
  movie.numberInStock--;
  movie.save();
  res.send(rental);

  /*
  try {
    console.log("Rentals POST inside try block");
    new Fawn.Task()
      .save('rentals', rental) //rentals is mongodb doc collections and case sensitive
      .update('movies', {_id: movie._id}, {
          $inc: { numberInStock: -1}
      })
      .run();

    res.send(rental);
  } catch(ex) {
    res.status(500).send('Something failed.');
  } 

  */
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 