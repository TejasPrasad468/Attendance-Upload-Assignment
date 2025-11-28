const { Worker } = require('bullmq');
const {getClient} = require("./utils/redisClient");
const PunchLog = require("./models/punchLogsModel");
const axios = require("axios");
const dbConnection = require("./db/dbConnection")


dbConnection(); // IMPORTANT!

const worker = new Worker("attendance_queue", async (job) => {
		console.log("Processing Job:", job.id);
		// Do something with job
		const punchData = await PunchLog.findById(job.data.logId);
		console.log(punchData);
		if (!punchData) {
			console.log("PunchLog not found:", job.data.logId);
			throw new Error("PunchLog not found");
		}
		try {
			console.log("Sending to CRM...");
			const res = await axios.post(
				"http://localhost:5000/crm/attendance/punch",
				punchData.toObject(),
				{ timeout: 5000 }
			);
			console.log("Response " + res.status );
			await PunchLog.updateOne(
				{ _id: job.data.logId },
				{ status: "synced" }
			);

			await job.remove();
			console.log("Synced & Job removed");
		} catch (err) {
			console.log("CRM Error:", err.message);

			const left = job.opts.attempts - job.attemptsMade;

			console.log("Attempts Left:", left);

			if (left <= 1) {
				console.log("All retries failed → Marking DB as FAILED");

				await PunchLog.updateOne(
					{ _id: job.data.logId },
					{ status: "failed", retryCount: job.attemptsMade }
				);
			}

			throw err; // Let BullMQ retry
		}

		throw new Error("API failed");
	},
	{
		connection: getClient()
	}
);

module.exports = worker;
