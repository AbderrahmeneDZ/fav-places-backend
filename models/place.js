var mongoose = require('mongoose');

var placeSchema = mongoose.Schema({
    title: { type: String },
    description: { type: String },
    userId: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
})

mongoose.model('Places', placeSchema)