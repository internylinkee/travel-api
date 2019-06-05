const Joi = require('joi');

module.exports = {
  get: {
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },

  update: {
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
    body: {
      firstName: Joi.string()
        .min(1)
        .max(255),
      lastName: Joi.string()
        .min(1)
        .max(255),
      facebookUrl: Joi.string().max(255),
      phone: Joi.string()
        .min(9)
        .max(255),
      location: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
      certificate: Joi.string()
        .min(2)
        .max(255),
      introduction: Joi.string()
        .min(2)
        .max(255),
    },
  },
};
