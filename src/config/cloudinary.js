const cloudinary = require('cloudinary').v2;
const { cloudinaryEnv } = require('./vars');

cloudinary.config(cloudinaryEnv);

module.exports = cloudinary;
