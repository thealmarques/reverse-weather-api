require('custom-env').env('dev')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
let Statistics = require('./model/Statistics');
let CountryModel = require('./model/Country');
let _ = require('underscore');

// define the REST API builder
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// Adding morgan to log HTTP requests
app.use(morgan('combined'));

mongoose.connect('mongodb://' + process.env.MONGO_DB + '/weather', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
    if (err) throw err;
    console.log('Mongodb connecting...');

    // Listen to the server
    app.listen(3001, () => {
        console.log('listening on port 3001...');
    });
});

app.get('/countries', async (req, res) => {
    let result = [];
    for (let i = parseInt(req.query.minTemp); i <= parseInt(req.query.maxTemp); i++) {
        let queryRes = await CountryModel.find({
            minTemp: {
                $lte: i
            },
            maxTemp: {
                $gte: i
            },
            month: req.query.month
        })
        if (queryRes.length != 0) {
            result = _.union(result, queryRes);
        }
    }
    if (result.length != 0) {
        res.status(200);
        res.send(_.uniq(result, function(res) { 
            return res.country; 
        }));
    }
    res.status(404);
    res.send();
});

app.get('/cities', async (req, res) => {
    let Model = mongoose.model(req.query.country, Statistics, req.query.country);
    let queryRes = await Model.find({
        avgTemp: {
            $lte: req.query.maxTemp,
            $gte: req.query.minTemp
        },
        country: req.query.country,
        month: req.query.month
    });

    if (queryRes.length != 0) {
        res.status(200);
        res.send(queryRes);
    }
    
    res.status(404);
    res.send();
});