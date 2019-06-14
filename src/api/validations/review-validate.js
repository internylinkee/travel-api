const Joi = require('joi');

module.exports = {
  create: {
    body: {
      text: Joi.string()
        .min(2)
        .max(255)
        .required(),
      rating: Joi.number()
        .min(0)
        .max(5)
        .required(),
      tourGuideId: Joi.string()
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
      text: Joi.string()
        .min(2)
        .max(255)
        .required(),
      rating: Joi.number()
        .min(0)
        .max(5)
        .required(),
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
