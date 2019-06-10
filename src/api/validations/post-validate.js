const Joi = require('joi');

module.exports = {
  create: {
    body: {
      title: Joi.string()
        .min(2)
        .max(255)
        .required(),
      content: Joi.string()
        .min(2)
        .max(3000)
        .required(),
      categories: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .required(),
      locations: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .required(),
      type: Joi.string()
        .min(2)
        .max(255)
        .required(),
    },
  },
};
