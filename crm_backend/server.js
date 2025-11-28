const express = require('express');
const app = express();
const crmAttendance = require("./routes/crmAttendanceRoute");
const dbConnection = require("./db/dbConnection");

dbConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/crm/attendance/punch', crmAttendance);

app.listen(5000, () => {
    console.log(`Middleware server running on http://localhost:5000`)
});
