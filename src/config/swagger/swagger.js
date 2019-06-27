const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDefinition = require('./swagger.json');

const swaggerOptions = {
  swaggerDefinition: swaggerDefinition,
  tags: ['User', 'Auth'],
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
