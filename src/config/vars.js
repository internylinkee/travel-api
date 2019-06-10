require('dotenv').config();
module.exports = {
  mongo: {
    uri:
      process.env.NODE_ENV === 'test'
        ? process.env.MONGO_URI_TESTS
        : process.env.MONGO_URI,
  },
  cloudinaryEnv: {
    cloud_name: process.env.CL_NAME,
    api_key: process.env.CL_API_KEY,
    api_secret: process.env.CL_API_SECRET,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
