import mongoose from "mongoose";
import { DATABASE_URL } from "../env.js"; //
import Task from "../models/Task.js";
import data from "./mock-express.js";

/*
seeding is creating the very first data for testing api purpose

delete id property from 'mock.js' as mongoDB will create a new id starting with ObjectId(...)
add script in the package.json ' "seed": "node data/seed.js"' -> check data in the document, seeding completed
*/
// database connection
mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Connected to DB for seeding data!!"));

//async operation - model.method
await Task.deleteMany({}); // reset, deleting condition empty obj means all
await Task.insertMany(data); // add new data

mongoose.connection.close();
