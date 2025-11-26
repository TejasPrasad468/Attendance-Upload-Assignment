// utils/queue.js
const { Queue } = require("bullmq");
const { getClient } = require("./redisClient");

let attendanceQueue;

async function getAttendanceQueue() {
  if (!attendanceQueue) {
    const client = await getClient();
    attendanceQueue = new Queue("attendance_queue", {
      connection: client,
    });
  }
  return attendanceQueue;
}

async function addAttendanceJobProvider({ logId }) {
	// console.log(userId, punchTime);
  const queue = await getAttendanceQueue();
  // const logId = `${userId}_${punchTime}`;

  await queue.add(
    "attendanceJob",
    {logId: logId.toString()},
    {
      jobId: logId.toString(),
      attempts: 3,
      backoff: 5000,
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  console.log("Job pushed Successfully " + logId);
  return logId;
}

module.exports = { getAttendanceQueue, addAttendanceJobProvider };
