const { getClient } = require('../utils/redisClient');
const { addAttendanceJobProvider } = require('../utils/queue');
// const { param } = require('../routes/devicePunchRouter');
const PunchLog = require("../models/punchLogsModel");

savePunchData = async (req, res) => {
  // handle request
  try {
    const client = await getClient(); // get the same connection
    const userKey = `attendance:${req.validatedData.userId}`;

    const exists = await client.get(userKey);
    if (exists) {
      return res.json({ success: false, message: 'User already punched' });
    }
    else {
      await client.set(userKey, JSON.stringify(req.validatedData),  'EX', 60 );
      // console.log(JSON.stringify(req.validatedData));
     
      let savedLog = await PunchLog.collection.insertOne({
        userId: req.validatedData.userId,
        deviceId: req.validatedData.deviceId,
        punchTime: new Date(req.validatedData.timestamp),
        type: req.validatedData.type.toLowerCase(),
        status: "pending",
        retryCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("savedLog " + savedLog.insertedId);
      let params = {
        logId: savedLog.insertedId
      };
      await addAttendanceJobProvider(params);
      res.json({ success: true, message: 'Punch stored in Redis' });
    }
  }
  catch (err) {
    console.error('Error saving attendance:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
//   res.json({ message: 'Data saved' });
};

module.exports = savePunchData;
