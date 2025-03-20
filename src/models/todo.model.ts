import mongoose, { Schema, Document } from "mongoose";

export interface todoDoc extends Document {
  _id: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  title: string;
  name: string;
  description: string;
  isDeleted: boolean;
}

const todoSchema = new Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "todo",
    timestamps: true,
  }
);

const ToDo = mongoose.model<todoDoc>("todo", todoSchema);

export { ToDo };
