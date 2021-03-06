const mongoose = require('mongoose');

const { mongo } = require('./vars');

mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

exports.connect = () => {
  mongoose.connect(mongo.uri, {
    keepAlive: 1,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });
  return mongoose.connection;
};
