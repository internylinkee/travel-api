require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDefinition = require('./swagger.json');
const { readdirSync } = require('fs');
const { resolve } = require('path');
const appDomain = process.env.APP_DOMAIN;

swaggerDefinition.servers = [
  {
    url: appDomain
      ? `${appDomain}`
      : `http://localhost:${process.env.PORT || 3000}`,
  },
];

const routePathsApi = readdirSync(resolve('src/api/routes')).map(
  item => `./src/api/routes/${item}`,
);
const routePathsAdmin = readdirSync(resolve('src/admin/routes')).map(
  item => `./src/admin/routes/${item}`,
);

const routePaths = routePathsApi.concat(routePathsAdmin);

const swaggerOptions = {
  swaggerDefinition: swaggerDefinition,
  tags: [
    'User',
    'Auth',
    'Post',
    'Category',
    'Location',
    'Application',
    'Upload',
    'Admin',
  ],
  apis: routePaths,
};

const specs = swaggerJsDoc(swaggerOptions);

module.exports = app => {
  return app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
