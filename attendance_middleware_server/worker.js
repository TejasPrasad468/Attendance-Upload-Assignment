const { Worker, Job } = require('bullmq');
const {getAttendanceQueue} = require("./utils/queue")
const {getClient} = require("./utils/redisClient")

const worker = new Worker("attendance_queue", async (job) => {
 console.log("📥 Processing Job:", job.id);

  // Do something with job
  return 'some value';
}, 
{
    connection: {
      // Your Upstash Redis credentials
      url: "rediss://default:ATxbAAIncDI5NWYyMTc4MGM5NzA0MDQ5YjAzNDMzNmQ1YmQyYzJmNHAyMTU0NTE@adapting-earwig-15451.upstash.io:6379",

      // REQUIRED FOR BULLMQ + UPSTASH
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    }
}
);


// // worker.js
// const { Worker } = require("bullmq");
// const axios = require("axios");
// const mongoose = require("mongoose");
// const getRedis = require("./utils/redisClient");
// const PunchLog = require("./models/PunchLog");

// // ----------------------------
// // 1. Connect to MongoDB
// // ----------------------------
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("📦 Worker connected to MongoDB"))
// .catch(err => console.error("❌ MongoDB Worker Error:", err));


// // ----------------------------
// // 2. Worker listens to queue
// // ----------------------------
// const worker = new Worker(
//   "attendance-log-queue",
//   async (job) => {
//     console.log("📥 Processing Job:", job.id);

//     const { userId, punchTime, rawData } = job.data;

//     // Get log from DB
//     let log = await PunchLog.findOne({ userId, punchTime });
//     if (!log) {
//       console.log("⚠ Log not found, skipping");
//       return;
//     }

//     try {
//       // ------------------------------------
//       // 3. Call CRM API
//       // ------------------------------------
//       const crmResponse = await axios.post(
//         "http://localhost:5001/crm/attendance/punch",
//         {
//           userId,
//           punchTime,
//           type: rawData.type
//         }
//       );

//       if (crmResponse.data.success) {
//         console.log("✅ CRM Synced Successfully:", job.id);

//         log.status = "synced";
//         await log.save();
//         return;
//       }

//       // If CRM API responds with success:false
//       throw new Error("CRM returned failure");

//     } catch (err) {
//       console.log("❌ CRM Sync Failed:", err.message);

//       log.status = "failed";
//       log.retryCount += 1;
//       await log.save();

//       // Throwing error tells BullMQ to retry
//       throw err;
//     }
//   },
//   {
//     connection: getRedis(),
//     concurrency: 5, // run 5 jobs at once
//   }
// );


// // ----------------------------
// // 4. Worker Events
// // ----------------------------
// worker.on("completed", (job) => {
//   console.log(`🎉 Job Completed: ${job.id}`);
// });

// worker.on("failed", (job, err) => {
//   console.log(`💥 Job Failed: ${job.id} | Error: ${err.message}`);
// });


// console.log("🚀 Worker is running...");
