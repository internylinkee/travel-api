const Joi = require('joi');

module.exports = {
  getList: {
    query: {
      category: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
      location: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
      user: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
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
  update: {
    body: {
      title: Joi.string()
        .min(2)
        .max(255),
      content: Joi.string()
        .min(2)
        .max(3000),
      categories: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
      locations: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
      type: Joi.string()
        .min(2)
        .max(255),
    },
  },
  like: {
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
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
  createComment: {
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
  getListComments: {
    params: {
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },
};
