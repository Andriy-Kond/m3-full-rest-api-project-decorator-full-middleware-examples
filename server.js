import { app } from "./app.js";
import mongoose from "mongoose";

// require("dotenv").config();
import "dotenv/config";

const port = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;

// console.log("process.env.DB_HOST:::", process.env.DB_HOST);
// console.log("process.env.PORT:::", process.env.PORT);
// console.log("process.env:::>", process.env);

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
