const Joi = require('joi');

module.exports = {
  markAsRead: {
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },
};
