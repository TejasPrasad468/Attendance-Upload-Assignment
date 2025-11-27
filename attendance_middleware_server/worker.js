const { Worker, Job } = require('bullmq');
const {getAttendanceQueue} = require("./utils/queue");
// const {getClient} = require("./utils/redisClient");
const PunchLog = require("./models/punchLogsModel");
const axios = require("axios");
const mongoose = require("mongoose");

// 1️⃣ Connect to MongoDB FIRST
async function connectDB() {
    try {
        await mongoose.connect(
            'mongodb+srv://tejaslp468:YVO10nXM6BhUxCeZ@cluster0.g92lvpx.mongodb.net/Attendance_Integration?retryWrites=true&w=majority&appName=Cluster0'
        );
        console.log("📌 Worker MongoDB connected!");
    } catch (err) {
        console.error("❌ Worker MongoDB connection error:", err);
    }
}

connectDB(); // IMPORTANT!

const worker = new Worker("attendance_queue", async (job) => {
		console.log("📥 Processing Job:", job.id);
		// Do something with job
		const punchData = await PunchLog.findById(job.data.logId);
		console.log("punchData " + punchData);
		if (!punchData) {
			console.log("PunchLog not found:", job.data.logId);
			throw new Error("PunchLog not found");
		}
		console.log("response0 ");
		try {
			console.log("➡️ Sending to CRM...");
			const res = await axios.post(
				"http://localhost:5000/",
				punchData.toObject(),
				{ timeout: 5000 }
			);
			console.log("Response " + res.status );
			// SUCCESS
			await PunchLog.updateOne(
				{ _id: job.data.logId },
				{ status: "synced" }
			);

			await job.remove();
			console.log("✅ Synced & Job removed");
		} catch (err) {
			console.log("❌ CRM Error:", err.message);

			const left = job.opts.attempts - job.attemptsMade;

			console.log("Attempts Left:", left);

			// LAST RETRY FAILED →
			if (left <= 1) {
				console.log("❌ All retries failed → Marking DB as FAILED");

				await PunchLog.updateOne(
					{ _id: job.data.logId },
					{ status: "failed", retryCount: job.attemptsMade }
				);
			}

			throw err; // Let BullMQ retry
		}
		// const res = await axios.post(
		// 	"http://localhost:5000/",
		// 	punchData.toObject(),
		// 	{ timeout: 5000 } // 🔥 5 second timeout
		// );
		// console.log("response " + res);
		// if (res.status >= 200 && res.status < 300) {
		// 	await PunchLog.updateOne(
		// 		{ _id: job.data.logId },
		// 		{ status: "synced" }
		// 	);

		// 	await job.remove();
		// 	console.log("✅ Synced & job removed:", job.id);
		// 	return;
		// }
		// console.log("response2 ");
		// const totalAttempts = job.opts.attempts || 1;
		// const attemptsMade = job.attemptsMade || 0;
		// console.log("retryCount " + retryCount);
		// await PunchLog.updateOne(
		// 	{ _id: job.data.logId },
		// 	{ retryCount: attemptsMade }
		// );

		// await job.updateProgress({ attemptsLeft: totalAttempts - attemptsMade });

		throw new Error("API failed");
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

module.exports = worker;
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
