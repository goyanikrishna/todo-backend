import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface userDoc extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  password: string;
  isDeleted: boolean;
  activeSessions: [string];
  matchPassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    activeSessions: [
      {
        type: String,
        default: [],
      },
    ],
  },
  {
    collection: "user",
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password,
          delete ret.__v,
          delete ret.updatedAt,
          delete ret.activeSessions;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  next();
});

userSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<userDoc>("user", userSchema);

export { User };
