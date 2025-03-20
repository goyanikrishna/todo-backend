import mongoose, { ConnectOptions } from "mongoose";
import config from "../config/index";

export default async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 10000,
    };

    mongoose.set("strictQuery", true);
    await mongoose
      .connect(config.mongoURL, options as ConnectOptions)
      .then((result) => {
        console.log("MongoDB successfully connected!");
      });
  } catch (err: any) {
    console.log(err);
  }
};
