require('custom-env').env('dev')

const mockStats = require('./mock/stats');
const mockCountry = require('./mock/country');
const mongoose = require('mongoose');
let Statistics = require('./model/Statistics');
let CountryModel = require('./model/Country');

mongoose.connect('mongodb://' + process.env.MONGO_DB + '/weather', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
    if (err) throw err;
    console.log('Mongodb connecting...');
    let initialCountry = '';

    // fill general statistics data
    for (let i = 0; i < mockStats.length; i++) {
        const val = mockStats[i];
        let Model = null;
        if (initialCountry != val.country) {
            Model = mongoose.model(val.country, Statistics, val.country);
        }
        let entry = new Model({
            country: val.country,
            city: val.city,
            month: val.month,
            latitude: val.latitude,
            longitude: val.longitude,
            minTemp:  val.minTemp,
            maxTemp: val.maxTemp,
            avgTemp: val.avgTemp,
            precp: val.precp
        });

        entry.save().then(doc => {
            console.log('General ' + i + ' added');

            if (i === mockStats.length-1) {
                console.log('Connection closed by the server');
                mongoose.disconnect();
            }
        })
        .catch(err => {
            console.log('Error');
        });
    }

    //fill country stats data
    for(let i = 0; i < mockCountry.length; i++) {
        const val = mockCountry[i];

        let entry = new CountryModel({
            country: val.country,
            month: val.month,
            minTemp:  val.minTemp,
            maxTemp: val.maxTemp,
            minPrecp: val.minPrecp,
            maxPrecp: val.maxPrecp,
        });

        entry.save().then(doc => {
            console.log('Country ' + i + ' added');

            if (i === mockCountry.length-1) {
                console.log('Connection closed by the server');
                mongoose.disconnect();
            }
        })
        .catch(err => {
            console.log('Error');
        });
    }
});