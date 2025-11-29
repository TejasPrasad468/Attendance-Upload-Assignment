const { getClient } = require('../utils/redisClient');
const { addAttendanceJobProvider } = require('../utils/queue');
const PunchLog = require("../models/punchLogsModel");

savePunchData = async (req, res) => {
  try {
    const redisClient = await getClient(); // get the same connection
    const userKey = `attendance:${req.validatedData.userId}`;

    const exists = await redisClient.get(userKey);
    if (exists) {
      const ttl = (await redisClient.ttl(userKey) * 1);
      return res.status(409).json({ success: false, message: `User already punched please try after ${ttl} seconds` });
    }
    else {
      await redisClient.set(userKey, JSON.stringify(req.validatedData), 'EX', 60 );

      const savedLog = await PunchLog.collection.insertOne({
        userId: req.validatedData.userId,
        deviceId: req.validatedData.deviceId,
        punchTime: req.validatedData.timestamp,
        type: req.validatedData.type.toLowerCase(),
        status: "pending",
        retryCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const params = {
        logId: savedLog.insertedId
      };
      await addAttendanceJobProvider(params);
      res.status(201).json({ success: true, message: 'Your Attendance successfully saved will be updated in CRM in few minutes' });
    }
  }
  catch (err) {
    console.error('Error saving attendance:', err);
    res.status(500).json({ success: false, message: 'Server error saving attendance data' });
  }
//   res.json({ message: 'Data saved' });
};

module.exports = savePunchData;
