const docapp = require("express")();
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const api_version = require("./package.json").version;

const cdir = process.env.CL_REST_STATE_DIR
  ? process.env.CL_REST_STATE_DIR
  : __dirname;
process.chdir(cdir);

const hostdef = "localhost:" + config.PORT;

const swaggerDefinition = {
  info: {
    title: "C-Lightning-REST",
    version: api_version,
    description: "REST API suite for C-Lightning",
  },
  host: hostdef,
  basePath: "/v1",
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "macaroon",
      scheme: "bearer",
      in: "header",
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

docapp.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

//Route for swagger documentation
docapp.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = docapp;
