const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'week5',
    description: 'node 直播班第五週 api'
  },
  host: 'localhost:3000',
  schemes: ['http','https'],
}

const swaggerFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(swaggerFile, endpointsFiles, doc);