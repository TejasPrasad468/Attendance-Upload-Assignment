const express = require('express');
const app = express();
const devicePunchRouter = require("./routes/devicePunchRouter");
const dbConnection = require("./db/dbConnection");

dbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/device/punch', devicePunchRouter);

app.listen(4000, () => {
    console.log(`Middleware server running on http://localhost:4000`)
});
