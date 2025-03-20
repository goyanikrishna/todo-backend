import mongoose from "mongoose";

export interface ListToDoPayload {
  searchString?: string;
  page_size: number;
  page_number: number;
}

export interface UpdateToDoPayload {
  todoId?: mongoose.Types.ObjectId;
  title?: string;
  name?: string;
  description?: string;
}
