require('custom-env').env()

const redis = require('redis');
const mockData = require('./mock/stats');

let client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

client.on('connect', function() {
    console.log('Redis client connected...');
    for (let i = 0; i < mockData.length; i++) {
        const val = mockData[i];
        const id = 'STATS:' + (i+1);
        client.hmset([
            id, 
            'country', val.country,
            'city', val.city,
            'month', val.month,
            'latitude', val.latitude,
            'longitude', val.longitude,
            'minTemp', val.minTemp,
            'maxTemp', val.maxTemp,
            'avgTemp', val.avgTemp,
            'precp', val.precp
        ], function (err, res) {
            if (err) throw err;
            console.log('Mock ' + i + ' added');
        });
        client.zadd([
            'avg_temp', val.avgTemp, id
        ], function(err, res) {
            if (err) throw err;
            console.log('Index ' + i + ' added');

            if (i === mockData.length-1) {
                console.log('Connection closed by the server');
                client.quit();
            }
        })
    }
});

