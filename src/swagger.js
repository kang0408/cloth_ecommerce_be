const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const PORT = process.env.PORT;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clothes Management API",
      version: "1.0.0",
      description: "API for clothes management system"
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Local server"
      },
      {
        url: "https://cloth-management-be.onrender.com/api/v1",
        description: "Render Deployment"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: [path.join(__dirname, "./routes/v1/*.js")]
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
};

module.exports = swaggerDocs;
