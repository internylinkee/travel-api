const Joi = require('joi');

module.exports = {
  getList: {
    query: {
      page: Joi.number()
        .integer()
        .min(1)
        .default(1),
      q: Joi.string()
        .min(2)
        .max(255),
    },
  },

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
      avatar: Joi.string()
        .min(9)
        .max(255),
      background: Joi.string()
        .min(9)
        .max(255),
      location: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
      certificate: Joi.string()
        .min(2)
        .max(255),
      introduction: Joi.string()
        .min(2)
        .max(255),
      dob: Joi.date().max('now'),
      isMale: Joi.boolean(),
    },
  },

  follow: {
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },
};
