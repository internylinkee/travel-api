const Joi = require('joi');

module.exports = {
  getList: {
    query: {
      role: Joi.string(),
      tourGuide: Joi.boolean(),
      q: Joi.string()
        .min(2)
        .max(255),
      page: Joi.number().integer(),
    },
  },
  delete: {
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },
};
