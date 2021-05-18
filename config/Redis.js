const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on('ready', function(){
    client.on('error', function(){
        //still more logging to doc
        console.log('Error connecting to cache')
    })
    console.log('Cache is connected and ready');
});

module.exports = {
    client
};