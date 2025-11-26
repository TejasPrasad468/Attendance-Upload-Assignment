const { getClient } = require('../utils/redisClient');
const { addAttendanceJobProvider } = require('../utils/queue');
const { param } = require('../routes/devicePunchRouter');

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
		console.log(JSON.stringify(req.validatedData));
		let params = {
			userId: req.validatedData.userId,
			punchTime: req.validatedData.timestamp
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
