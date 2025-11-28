const express = require("express");
const router = express.Router();
const attendanceDatas = require("../controllers/attendanceDatas");

router.post('/', attendanceDatas);

module.exports = router;