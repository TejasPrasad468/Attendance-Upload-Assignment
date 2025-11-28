// utils/redisClient.js
const Redis = require("ioredis");

let client; // singleton

function getClient() {
  if (!client) {
    client = new Redis("rediss://default:ATxbAAIncDI5NWYyMTc4MGM5NzA0MDQ5YjAzNDMzNmQ1YmQyYzJmNHAyMTU0NTE@adapting-earwig-15451.upstash.io:6379", 
      {
        maxRetriesPerRequest: null,
        enableReadyCheck: false
      }
    );

    client.on('connect', () => console.log('Redis connected'));
    client.on('error', (err) => console.error('Redis Client Error', err));
  }

  return client;
}

getClient();
module.exports = { getClient };
