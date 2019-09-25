const mongoose = require('mongoose');

const Schema = mongoose.Schema; 
const Statistics = new Schema({
    country: String,
    city: String,
    month: Number,
    latitude: Number,
    longitude: Number,
    minTemp: Number,
    maxTemp: Number,
    avgTemp: Number,
    precp: Number
});

module.exports = Statistics;