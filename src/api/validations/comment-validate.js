const Joi = require('joi');

module.exports = {
  update: {
    body: {
      text: Joi.string()
        .min(2)
        .max(255)
        .required(),
    },
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },
  deleteOne: {
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },
};
