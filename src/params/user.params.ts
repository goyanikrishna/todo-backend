import Joi from "joi";

const userParams = {
  //PUT user/updateUser
  updateUser: {
    body: Joi.object({
      name: Joi.string(),
      phone: Joi.string(),
      email: Joi.string(),
    }),
  },
};

export default userParams;
