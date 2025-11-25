const express = require('express');
const app = express();
const {attendanceSchema} = require('./validators/attendance_validators.js');
const validateInput = require("./middleware/validateInput.js")

app.get('/', validateInput(attendanceSchema), (req, res) => {
    res.send(req.body);
});

app.listen(4000, () => {
    console.log(`Middleware server running on http://localhost:4000`)
});