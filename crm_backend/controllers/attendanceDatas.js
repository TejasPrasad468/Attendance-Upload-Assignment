// const attendanceSchema = require('../models/attendanceSchema');

// const attendanceDatas = async (req, res) => {
//     try {
//         const { userId, deviceId, punchTime, type } = req.body;

//         // convert punch date to YYYY-MM-DD
//         const punchDate = new Date(punchTime);
//         const dateOnly = new Date(punchDate.setHours(0, 0, 0, 0));

//         // Check if record already exists
//         const isExist = await attendanceSchema.findOne({
//             userId,
//             punchType: type,
//             punchDate: dateOnly
//         });

//         if (isExist) {
//             return res.status(200).json({
//                 success: true,
//                 message: `Record already exists for user ${userId} for ${type} on ${dateOnly.toDateString()}`,
//                 code: "ALREADY_EXISTS"
//             });
//         }

//         // Insert new entry
//         const newRecord = await attendanceSchema.create({
//             userId,
//             deviceId,
//             punchTime,
//             punchDate: dateOnly,
//             punchType: type
//         });

//         return res.status(201).json({
//             success: true,
//             message: "Data Inserted Successfully",
//             data: newRecord
//         });

//     } catch (err) {
//         console.error('Error saving attendance:', err);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };

// module.exports = attendanceDatas;


// controllers/attendanceController.js
const AttendanceModel = require('../models/attendanceSchema');

const attendanceDatas = async (req, res) => {
  try {
    const { userId, deviceId, punchTime, type } = req.body;

    // Normalize punchDate to date-only (midnight)
    const parsed = new Date(punchTime);
    const punchDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());

    // Debug: ensure Attendance is a model
    // console.log('ModelName:', Attendance.modelName); // should log 'Attendance'

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
      return res.status(200).json({
        success: true,
        message: 'Record already exists (duplicate key)',
        code: 'ALREADY_EXISTS'
      });
    }

    console.error('Error saving attendance:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = attendanceDatas;

