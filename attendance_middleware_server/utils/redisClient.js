const Redis = require("ioredis");

let client; // singleton

function getClient() {
  if (!client) {
    client = new Redis(process.env.REDIS_URL, 
      {
        maxRetriesPerRequest: null, // For bullmq worker we use this
        enableReadyCheck: false
      }
    );

    client.on('connect', () => console.log('Redis connected'));
    client.on('error', (err) => console.error('Redis Client Error', err));
  }

  return client;
}

// getClient();
module.exports = { getClient };
