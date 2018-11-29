// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


var port = process.env.PORT || 8099; // set our port

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/data'); // connect to our database
var Room = require('./app/model/Room');


// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


// on routes that end in /rooms
// ----------------------------------------------------
router.route('/rooms')

// create a bear (accessed at POST http://localhost:8080/rooms)
.post(function(req, res) {

    var room = new Room(); // create a new instance of the Room model
    room.name = req.body.name;
    room.capacity = req.body.capacity;

    room.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Room created!' });
    });


}).get(function(req, res) {
    Room.find(function(err, _room) {
        if (err)
            res.send(err);
        res.json(_room);
    });
});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);