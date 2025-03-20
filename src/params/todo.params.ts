import Joi from "joi";

const todoParams = {
  //POST todo/createToDo
  createToDo: {
    body: Joi.object({
      title: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
    }),
  },

  //POST todo/listToDos
  listToDos: {
    body: Joi.object({
      searchString: Joi.string().allow(""),
      page_size: Joi.number().required(),
      page_number: Joi.number().required(),
    }),
  },

  //PUT todo/updateToDo
  updateToDo: {
    body: Joi.object({
      todoId: Joi.string().hex().required(),
      title: Joi.string(),
      name: Joi.string(),
      description: Joi.string(),
    }),
  },

  //DELETE todo/deleteToDo
  deleteToDo: {
    query: Joi.object({
      todoId: Joi.string().hex().required(),
    }),
  },
};

export default todoParams;
