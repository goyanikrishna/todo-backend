import Joi from "joi";

require("dotenv").config();

const envVarsSchema = Joi.object({
  PORT: Joi.number(),
  MONGODB_URL: Joi.string(),
  BACKEND_URL: Joi.string(),
  WEB_URL: Joi.string(),

  JWTSECRET: Joi.string(),
  EXPIRESIN: Joi.string(),
  SALT: Joi.number(),
})
  .unknown()
  .required();

const { value: envVars, error } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  port: envVars.PORT,
  mongoURL: envVars.MONGODB_URL,
  backendURL: envVars.BACKEND_URL,
  frontendURL: envVars.WEB_URL,

  jwtSecret: envVars.JWTSECRET,
  expiresIn: envVars.EXPIRESIN,
  salt: envVars.SALT,
};

export default config;
