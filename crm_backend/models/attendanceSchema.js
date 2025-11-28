const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    
    userId: {
        type: String,
        required: true,
        trim: true
    },

    deviceId: {
        type: String,
        required: true,
        trim: true
    },

    punchTime: {
        type: Date,
        required: true
    },

    punchDate: {
        type: Date,
        required: true,
        index: true   // helps fast lookups for specific day
    },

    punchType: {
        type: String,
        enum: ["in", "out"],
        required: true
    }

}, { timestamps: true });

const AttendanceModel = mongoose.model('Attendance', attendanceSchema);

module.exports = AttendanceModel;
