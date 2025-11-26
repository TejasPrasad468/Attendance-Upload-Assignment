const express = require('express');
const router = express.Router();
const saveData = require('../controllers/savePunchData.js');
const {attendanceSchema} = require('../validators/attendance_validators.js');
const validateInput = require("../middleware/validateInput.js");

router.post('/', validateInput(attendanceSchema), saveData);

module.exports = router;
