const AttendanceModel = require('../models/crmAttendanceSchema');

const crmAttendanceDatas = async (req, res) => {
  try {
    const { userId, deviceId, punchTime, type } = req.body;
    // Normalize punchDate to date-only (midnight)
    const parsed = new Date(punchTime);
    const punchDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());

    const isExist = await AttendanceModel.findOne({
      userId,
      punchType: type,
      punchDate
    });
    if (isExist) {
      return res.status(200).json({
        success: true,
        message: `Record already exists for user ${userId} for ${type} on ${punchDate.toDateString()}`,
        code: 'ALREADY_EXISTS'
      });
    }

    const newRecord = await AttendanceModel.create({
      userId,
      deviceId,
      punchTime: parsed,
      punchDate,
      punchType: type
    });

    return res.status(201).json({
      success: true,
      message: 'Data Inserted Successfully',
      data: newRecord
    });

  } catch (err) {
    // if duplicate index set to unique:true, handle duplicate key error separately
    if (err.code === 11000) {
      return res.status(409).json({
        success: true,
        message: 'Record already exists',
        code: 'ALREADY_EXISTS'
      });
    }

    console.error('Error saving attendance:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = crmAttendanceDatas;

