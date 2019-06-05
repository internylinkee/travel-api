const Joi = require('joi');

module.exports = {
  register: {
    body: {
      email: Joi.string()
        .email()
        .max(255)
        .required(),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
      firstName: Joi.string()
        .min(1)
        .max(255)
        .required(),
      lastName: Joi.string()
        .min(1)
        .max(255)
        .required(),
    },
  },
};
