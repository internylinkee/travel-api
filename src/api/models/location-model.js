const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Location', locationSchema);
