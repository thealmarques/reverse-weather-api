require('custom-env').env('dev')

const redis = require('redis');

let client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
client.flushall();
client.flushdb();
client.quit();

console.log('DB Flushed and deleted');