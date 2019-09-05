var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const cors = require('cors')

const routePlaces = require('./routes/placesController');
const routeUsers = require('./routes/usersController');

mongoose.connect('mongodb://localhost/dbFavLocations');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use('/api/places', routePlaces);
app.use('/api/users', routeUsers);

app.get('/', (req, res) => {
    res.send('Welcome to Favorite Locations App API');
})

app.listen(3000);
console.log("Running app on 3000...");