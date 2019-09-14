const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

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

let client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

client.on('connect', () => {
    console.log('Redis connected...');

    // Listen to the server
    app.listen(3001, () => {
        console.log('listening on port 3001...');
    });
})

app.get('/', async (req, res) => {
    let result = [];
    let indexes = await getIndexes({
        month: req.query.month,
        minTemp: req.query.minTemp,
        maxTemp: req.query.maxTemp
    });

    for (let i = 0; i < indexes.length; i++) {
        let index = indexes[i];
        let properties = await getIndex(index);
        result.push(properties);
    }

    if (result.length != 0) {
        res.status(200);
        res.send(result);
    }
    res.status(404);
    res.send();
});

function getIndexes(params) {
    return new Promise((resolve, reject) => {
        client.zrangebyscore('avg_temp:' + params.month, params.minTemp, params.maxTemp, (err, members) => {
            if (!err) {
                resolve (members);
            }
            reject(null);
        });
    });
}

function getIndex(param) {
    return new Promise((resolve, reject) => {
        client.hgetall(param, (err, members) => {
            if (!err) {
                let item = {};
                for (i in members) {
                    item[i] = members[i];
                 }
                resolve (item);
            }
            reject(null);
        });
    });
}