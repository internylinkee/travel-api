const Joi = require('joi');

module.exports = {
  getList: {
    query: {
      admin: Joi.boolean(),
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
