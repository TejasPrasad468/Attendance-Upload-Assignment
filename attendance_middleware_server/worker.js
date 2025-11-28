const { Worker } = require("bullmq");
const axios = require("axios");
const PunchLog = require("./models/punchLogsModel");
const { getClient } = require("./utils/redisClient");
const dbConnection = require("./db/dbConnection");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env")});

dbConnection(); // connect DB 

// Fetch punch log safely
async function fetchPunchLog(id) {
  const log = await PunchLog.findById(id);
  if (!log) {
	throw new Error(`PunchLog not found: ${id}`)
  }
  return log;
};

// API call to CRM server
async function syncAttendanceAPI(data) {
  let res = await axios.post(
    `${process.env.CRM_API}/crm/attendance/punch`,
    data
  );
  return res;
};

// Update punch status
async function updatePunchStatus(id, status, retryCount = 0) {
  console.log(`Job ${id} marked as ${status}`);
  await PunchLog.updateOne(
    { _id: id },
    { status, retryCount }
  );
};

// Handle final failure (after all retries)
async function handleFinalFailure(job) {
  await updatePunchStatus(job.data.logId, "failed", job.attemptsMade);
};

const worker = new Worker(
  "attendance_queue",
  async (job) => {
    const attemptsLeft = job.opts.attempts - job.attemptsMade;
    const punchData = await fetchPunchLog(job.data.logId);
    try {
      const response = await syncAttendanceAPI(punchData);
      if (response.status === 200 || response.status === 201 || response.status === 409) {
        await updatePunchStatus(job.data.logId, "synced");
        return "Synced Successfully";
      }

      // Non-200 status
      if (attemptsLeft <= 1) await handleFinalFailure(job);
      throw new Error("API did not return success");

    } 
	catch (err) {
	  console.log("Error from worker side " + err);
      if (attemptsLeft <= 1) await handleFinalFailure(job);
      throw err; // let BullMQ retry
    }
  },
  { connection: getClient() }
);

module.exports = worker;
