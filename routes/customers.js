const express = require('express');
const mongoose = require('mongoose');
//const Joi = require('joi'); //validate moved to models/customer.js
//model/customer.js knows what is a customer and how should look like
const {Customer, validate} = require('../models/customer');
const router = express.Router();

console.log(`type of express = ${typeof express}`); //function
/*
in Javascript functions are objects; so express is an object
being an object, express can have its own properties, attributes and methods
so express.Router() is function(method) property of express

//https://stackoverflow.com/questions/27599614/var-express-requireexpress-var-app-express-what-is-express-is-it

Some modules return a function, other modules return an object with properties/methods on it. 
Technically, a module could return anything, including just a number or string. 

*/
console.log(`type of mongoose = ${typeof mongoose}`); //object
console.log(`type of Joi = ${typeof Joi}`);//object
console.log(`type of router = ${typeof router}`);//function

router.get('/', async (req, res) => {
    const customers = await Customer
                              .find()
                              .sort('name');
    res.send(customers);
});

/*

POST req from postman

http://192.168.0.111:3010/api/customers

{
    "name":"Ramki",
    "isGold": "true",
    "phone": "123456"
}
*/

router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    let newCustomer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });

    newCustomer = await newCustomer.save();

    res.send(newCustomer);
});



module.exports = router;

