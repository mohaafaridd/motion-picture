const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB');
    const connectionURL = `mongodb://${process.env.DB_IP}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;
    console.log(`connectionURL`, connectionURL);
    await mongoose.connect(connectionURL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.log('MongoDB Connection Failed');
    console.log(`error`, error);
  }
};

module.exports = {
  connectDB,
};
