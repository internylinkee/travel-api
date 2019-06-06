const Joi = require('joi');

module.exports = {
  create: {
    body: {
      location: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .error(() => ({ message: 'location must be a objectId' })),
      certificate: Joi.string()
        .min(2)
        .max(255)
        .required()
        .error(() => ({ message: 'certificate is required.' })),
      introduction: Joi.string()
        .min(2)
        .max(255)
        .required()
        .error(() => ({ message: 'introduction is required.' })),
    },
  },
};
