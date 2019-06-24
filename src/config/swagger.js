const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDefinition = {
  info: {
    title: 'Travel Swagger API',
    version: '1.0.0',
    description: 'This is usage APIs.',
  },
  host: `localhost:3000`,
  basePath: '/v1',
  schemes: ['http'],
  paths: {},
};
const swaggerOptions = {
  swaggerDefinition: swaggerDefinition,
  tags: ['User'],
  apis: [
    './src/api/routes/user******.js',
    './src/api/routes/review******.js',
    './src/api/routes/auth******.js',
  ],
};

const specs = swaggerJsDoc(swaggerOptions);

module.exports = app => {
  return app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
