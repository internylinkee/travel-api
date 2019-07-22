const Joi = require('joi');

module.exports = {
  getList: {
    query: {
      page: Joi.number()
        .integer()
        .min(1),
      q: Joi.string()
        .min(1)
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

  create: {
    body: {
      location: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error(() => ({ message: 'location must be a objectId' })),
      certificate: Joi.string()
        .min(2)
        .max(3000)
        .required()
        .error(() => ({ message: 'certificate is required.' })),
      introduction: Joi.string()
        .min(2)
        .max(3000),
      expirence: Joi.string()
        .min(2)
        .max(3000),
      languages: Joi.string()
        .min(2)
        .max(300)
        .required(),
      isMale: Joi.boolean().required(),
      phone: Joi.string().required(),
      dob: Joi.date()
        .max('now')
        .required(),
    },
  },

  cancel: {
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },
};
