// const { createClient } = require('redis');
// let client;
// console.log(client._eventsCount);
// client = createClient({
// url: "rediss://default:ATxbAAIncDI5NWYyMTc4MGM5NzA0MDQ5YjAzNDMzNmQ1YmQyYzJmNHAyMTU0NTE@adapting-earwig-15451.upstash.io:6379"
// });

// client.on("error", function(err) {
// 	throw err;
// });

// client.connect();
// console.log(client);

// return;
// module.exports = client;

// utils/redisClient.js
const Redis = require("ioredis");

let client; // singleton

function getClient() {
  if (!client) {
    client = new Redis("rediss://default:ATxbAAIncDI5NWYyMTc4MGM5NzA0MDQ5YjAzNDMzNmQ1YmQyYzJmNHAyMTU0NTE@adapting-earwig-15451.upstash.io:6379");

    client.on('connect', () => console.log('Redis connected'));
    client.on('error', (err) => console.error('Redis Client Error', err));
  }

  return client;
}

getClient();
module.exports = { getClient };
