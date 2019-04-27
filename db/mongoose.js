const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
};

module.exports = {
  connectDB,
};
