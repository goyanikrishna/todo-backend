import express from "express";
import App from "./services/express";
import dbConnection from "./services/database";

const startServer = async () => {
  const app = express();
  await dbConnection();
  await App(app);

  const port = process.env.PORT || 5050;
  app.listen(port, () => {
    console.log(`Server is started on port ${port}`);
  });
};

(async () => {
  await startServer();
})();
