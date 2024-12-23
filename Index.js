import { app } from "./app.js";
import mongoose from "mongoose";

const port = 3000;
const DB_HOST =
  "mongodb+srv://admin:SpacejamTron86@cluster0.2pscb.mongodb.net/test_db?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("DB connecting successful");
    app.listen(port, () => console.log(`Server running on port :>> ${port}`));
  })
  .catch(err => {
    console.log(err.message);
    process.exit(1); // The command process.exit() close running processes with error. "1" - means "unknown error".
  });
