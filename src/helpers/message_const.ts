export const ErrMessages = {
  // auth
  invalidEmail: "Invalid Email!",
  sessionExpired:
    "Session expired. you have been logged out, please log in again!",
  badToken: "bad token!",
  tokenNot: "token not provided!",
  badAuth: "bad authorization!",
  incorrectPassword: "Incorrect Password!",

  // user
  sameUser: "A user with same email is already present!",
  userExist: "User already exists.",
  userNotFound: "user not found!",
  userNotExist: "user not exist!",
  noAccessDeleteUser:
    "Please delete your TODO items before deleting your account.",

  // todo
  todoNotFound: "Todo not found!",
};

export const SuccessMessages = {
  // user
  userCreated: "User created successfully",
  userUpdated: "User updated successfully",
  userDeleted: "User deleted successfully",

  // todo
  todoCreated: "Todo created successfully",
  todoUpdated: "Todo updated successfully",
  todoDeleted: "Todo deleted successfully",
};
