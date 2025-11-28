const express = require("express");
const router = express.Router();
const crmAttendanceDatas = require("../controllers/crmAttendanceDatas");

router.post('/', crmAttendanceDatas);

module.exports = router;