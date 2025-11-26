const {Queue} = require("bullmq");
const {getClient} = require("./redisClient");

const attendanceQueue = new Queue("attendance_queue", {
	connection: getRedis()
});

async function addAttendanceJobProvider({userId, punchTime}) {
	const logId = `${userId}_${punchTime}`;

	await attendanceQueue.add(
		"attendanceJob",
		{
			userId,
			punchTime
		},
		{
			jobId: logId,
			attempts: 3,
			backoff: 5000,
			removeOnComplete: true,
			removeOnFail: false
		}
	);

	console.log("Job pushed Successfully " + logId);
	return logId;
}

module.exports = {
	attendanceQueue,
	addAttendanceJobProvider
};