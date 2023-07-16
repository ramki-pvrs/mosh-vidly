//middleware function
//in express, technically every route handling function (req, res) => {} is a middleware function
    //it takes req object as input and outputs res object and also this route handling function terminates req-res cycle
//app.use(express.json()) is a middleware function again, looks for json obj in http recevd body and parses it to json object and sets req.body in node with that json object
    //after that we can use req.body in our code as json obj

//express: request processing pipeline
//Request ---> Middleware1 next() ----> Middleware2 next() ----> Middleware 3 and req-response process terminated by Middleware 3
//e.g. json() and route() handling fn (the (req,res)=>{} in routes below)

//custom middleware possible; logging, authentication, authorization
//EXPRESS APP IS NOTHING BUT A BUNCH OF MIDDLEWARE FUNCTIONS


//BUILT IN MIDDLEWARES
//express.json()
//express.urlencoded() //not typical but if you have body of req like key1=value1&key2=value2, then this urlencoded middleware is required; populates req.body similat to json()
//i.e. instead of json body if you recelve x-www-form-urlencoded (posttman goto POST Body tab and you will see this option)
//which sends key=val pairs

//third party middleware
//helmet : http headers setting; node is throwins module not found error
//morgan : log http requests


//ObjectId
//_id 644499830689fe5e374c86e6
//12 bytes: 
//4 bytes: Timestamp
//3 bytes: machine id
//2 bytes: process id
// 3 bytes: counter
//2^24 bits for counter: 16Million ids possible

//Actually MongodB Driver sets the object id and not Mongodb itself
// mongoose can talk to Mongodb driver and return just a object id
//const someId = new mongoose.Types.ObjectId();
//console.log(someId); just generated in Memory, nothing todo with MongodB yet
//someId.getTimestamp();
//mongoose.Types.ObjectId.isValid('1234'); throws false
//validates objectId

//you will see path "_id" in some messages. path meaning here chain of properties
//like customer can have address and address can have house number

//Authentication: confirm who you are
//Authorization: are you authorised to do something, e.g. delete objects

//Register Users /api/users POST
//Login users: POST 
//Login is really not CRUD ops because neither we are creating nor updating
//so, we consider it as creating new request or command and use POST
// /api/logins - login resource



const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi); //returns a function

const mongoose = require('mongoose');



const config = require('config');
//const appDebug = require('debug') returns a function to which you pass some arbitrary namespace name
//export DEBUG=app:.* you need to do this in os cmd prompt before starting your app for debug prints to work
const appDebugLog = require('debug')('app:appDebugLog'); 
const appInfoLog = require('debug')('app:appInfoLog'); 
const dbDebugLog = require('debug')('app:dbDebugLog'); 
const dbInfoLog = require('debug')('app:dbInfoLog'); //app: gives starign name space, so in os cmd prompt you can do export DEBUG=app
//console.log(typeof Joi); //object which means Joi is a class
const express = require('express');
const home = require('./routes/home'); //returns a router
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');

const logger = require('./middlewares/logger'); //returns  a function from logger.js which is a middlware function
const helmet = require('helmet');
const morgan = require('morgan');


//create an Express app instance
const app = express(); //express is a function from require('express') and when called it returns a Express object
//https://stackoverflow.com/questions/44384605/what-does-requireexpress-do-in-nodejs


//connect method returns a Promise
mongoose.connect("mongodb+srv://ramkinode:ramkinode@cluster0.qoqsp.mongodb.net/vidly?retryWrites=true&w=majority")
 .then(() => console.log("Connected to cloud mongo"))
 .catch(err => console.log("Could not connect to Mongodb", err));






app.use(express.json());

//CUSTOM MIDDLEWARE FUNCTION; NOTE THE next() call otherwise you app hangs

/*
//move this log function to middlewares/logger.js and require it in index.js
app.use(function (req, res, next) {
    console.log("Custom Middleware : Logging middleware : logging something....");
    next(); 
    //either teminate or pass the baton to next() middleware 
    //because express is nothing but bunch of middleware functions 
    //working in sequence on processing one request till req-response cycle is terminated; 
    //the last middleware will terminate
});

*/

app.use(logger);


app.use(function (req, res, next) {
    console.log("Custom Middleware : Auth middleware : authentication successful....");
    next();
});

app.use(express.urlencoded({ extended: true}));
app.use(express.static('public')); //public folder to serve static files
app.use(helmet());


app.use('/', home);
//we are telling express that for any routes starting with /api/genres, use genres router
app.use('/api/genres', genres);
app.use('/api/movies', movies);




//ERROR On this line
///home/ubuntu/Documents/mosh/node/vidly/node_modules/express/lib/router/index.js:469
//throw new TypeError('Router.use() requires a middleware function but got a ' + gettype(fn))
//TypeError: Router.use() requires a middleware function but got a Object

//because in routes/customers.js forgot to add line 
app.use('/api/customers', customers);

app.use('/api/rentals', rentals);




console.log(`current node environment : ${process.env.NODE_ENV}`);
const env = app.get('env'); //default development
console.log(`current app env = ${env}`);

//you can control code blokcs by env whether development, production; need to set NODE_ENV variable on os cmd line before starting the nodemon index.js app
//in cmd prompt export NODE_ENV=production and then nodemon index.js

//npm config middleware

//console.log(appDebugLog);

//appDebugLog('using appDebugLog call : Morgan, the http req logging middleware function module enabled...');
//CONFIGURATION FROM config folder default, development, production
console.log("Application Name: " + config.get('name'));
console.log("Mail Server Host: " + config.get('mail.host'));

//password as env variable os cmd line : export vidly_devmailserver_password=1234Text
//create a file in config folder with exact name custom-environment-variables and add json object
//vidly_devmailserver_password is the env variable set by user


//config object scans all config files to find .variables
console.log("Mail Server Password: " + config.get('mail.password')); //this will print 1234Text set in cmd prompt for vidly_devmailserver_password present in custom-environment-variables file

//appDebugLog('using appDebugLog call : Morgan, the http req logging middleware function module enabled...');
//if you set export NODE_ENV=production this the morgan module will not be used
if(app.get('env') == 'development') {
    app.use(morgan('tiny')); //in terminal you see something like GET / 404 139 - 4.623 ms for GET request http://192.168.0.113:3001/api/genres
    //instead of console log use
    appDebugLog('using appDebugLog call : Morgan, the http req logging middleware function module enabled...');
    console.log('Morgan, the http req logging middleware function module enabled...');
    //console.log("Application Name: " + config.get('name'));
    //console.log("Mail Server Host: " + config.get('mail.host'));

    
}


//SOME DB work and you want to log
dbInfoLog("Some db info log; based on development or production environment you can call dbDebugLog or dbInfoLog with different data to be printed in console");


//Another custom middleware, for auth
//for some reasonm this is not working if this code block is present here
//so moved up
//app.use(function (req, res, next) {
  //  console.log("Custom Middleware : Auth middleware : authentication successful....");
    //next();
//});



const port = process.env.PORT || 3010;

app.listen(port, () => console.log(`vidly app listening on port ${port}`));








