import Joi from "joi";

const authParams = {
  //POST auth/registerUser
  registerUser: {
    body: Joi.object({
      name: Joi.string().min(3).required(),
      phone: Joi.string()
        .pattern(/^\d{10}$/)
        .min(10)
        .max(10)
        .required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  },

  //POST auth/login
  login: {
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
};

export default authParams;
