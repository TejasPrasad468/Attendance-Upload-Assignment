const express = require('express');
const app = express();
const crmAttendance = require("./routes/crmAttendanceRoute");
const dbConnection = require("./db/dbConnection");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env")});

dbConnection();

const PORT = process.env.CRM_PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/crm/attendance/punch', crmAttendance);

app.listen(PORT, () => {
    console.log(`CRM server running on port ${PORT}`);
});
