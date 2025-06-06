import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { Application } from "express";

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
        url: `http://localhost:${PORT}/api/v1`,
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
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [path.join(__dirname, "./routes/v1/*.ts")]
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
};

export default swaggerDocs;
