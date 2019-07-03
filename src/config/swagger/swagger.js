require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDefinition = require('./swagger.json');
const appDomain = process.env.APP_DOMAIN;

swaggerDefinition.servers = [
  {
    url: appDomain ? `${appDomain}/v1` : 'http://localhost:3000/v1',
  },
];

const swaggerOptions = {
  swaggerDefinition: swaggerDefinition,
  tags: ['User', 'Auth', 'Post'],
  apis: [
    './src/api/routes/user******.js',
    './src/api/routes/post******.js',
    './src/api/routes/review******.js',
    './src/api/routes/auth******.js',
  ],
};

const specs = swaggerJsDoc(swaggerOptions);

module.exports = app => {
  return app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
