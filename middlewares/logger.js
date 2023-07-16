


function log(req, res, next) {
    console.log("Custom Middleware : Logging middleware : logging something....");
    next(); 
    //either teminate or pass the baton to next() middleware 
    //because express is nothing but bunch of middleware functions 
    //working in sequence on processing one request till req-response cycle is terminated; 
    //the last middleware will terminate
}


module.exports = log;
