const mongoose = require('mongoose');

const Schema = mongoose.Schema; 
const Country = new Schema({
    country: String,
    month: Number,
    minTemp: Number,
    maxTemp: Number,
    avgTemp: Number,
    minPrecp: Number,
    maxPrecp: Number
});

module.exports = mongoose.model('Country', Country);