require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDefinition = require('./swagger.json');
const { readdirSync } = require('fs');
const { resolve } = require('path');
const appDomain = process.env.APP_DOMAIN;

swaggerDefinition.servers = [
  {
    url: appDomain ? `${appDomain}/v1` : 'http://localhost:3000/v1',
  },
];

const routePaths = readdirSync(resolve('src/api/routes')).map(
  item => `./src/api/routes/${item}`,
);

const swaggerOptions = {
  swaggerDefinition: swaggerDefinition,
  tags: ['User', 'Auth', 'Post', 'Category', 'Location'],
  apis: routePaths,
};

const specs = swaggerJsDoc(swaggerOptions);

module.exports = app => {
  return app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
