const express = require('express');
const router = express.Router();
const saveData = require('../controllers/savePunchData.js');
const {attendanceZodSchema} = require('../validators/attendance_validators.js');
const validateInput = require("../middleware/validateInput.js");

router.post('/', validateInput(attendanceZodSchema), saveData);

module.exports = router;
