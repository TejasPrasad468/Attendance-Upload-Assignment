const { Queue } = require("bullmq");
const { getClient } = require("./redisClient");

let attendanceQueue;

// For Redis connection to store userdata 
async function getAttendanceQueue() {
  if (!attendanceQueue) {
    const redisClient = await getClient();
    attendanceQueue = new Queue("attendance_queue", {
      connection: redisClient,
    });
  }
  return attendanceQueue;
}

// For BullMQ to store retry data
async function addAttendanceJobProvider({ logId }) { 
  const queue = await getAttendanceQueue();

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
