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

  cancel: {
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },

  confirm: {
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },
};
