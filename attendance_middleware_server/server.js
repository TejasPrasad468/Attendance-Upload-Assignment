const express = require('express');
const app = express();
const devicePunchRouter = require("./routes/devicePunchRouter");
const dbConnection = require("./db/dbConnection");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env")});

dbConnection();

const PORT = process.env.MIDDLEWARE_PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/device/punch/', devicePunchRouter);

app.listen(PORT, () => {
    console.log(`Middleware server running on port ${PORT}`);
});
