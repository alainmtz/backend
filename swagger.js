import swaggerAutogen from "swagger-autogen";

const outputFilename = 'swagger.json';
const endpointsFiles = ['./src/index.js'];
const doc = {
  info: {
    title: 'Inventory Management API',
    description: 'API documentation for the Inventory Management System',
  },
  host: 'localhost:4000',
  schemes: ['http'],
}
swaggerAutogen()(outputFilename, endpointsFiles, doc);