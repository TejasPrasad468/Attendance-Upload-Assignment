const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://tejaslp468:YVO10nXM6BhUxCeZ@cluster0.g92lvpx.mongodb.net/Attendance_Integration?retryWrites=true&w=majority&appName=Cluster0'
    );
    console.log('MongoDB Connected Successfully!');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
  }
};
dbConnection();
module.exports = dbConnection;
