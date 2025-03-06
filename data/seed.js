import mongoose from 'mongoose'
import data from './mock-express.js'
import Task from '../models/Task.js'
import { DATABASE_URL } from '../env.js' //

/*
seeding is creating the very first data for testing api purpose

delete id property from 'mock.js' as mongoDB will create a new id starting with ObjectId(...)
add script in the package.json ' "seed": "node data/seed.js"' -> check data in the document, seeding completed
*/
// database connection
mongoose.connect(DATABASE_URL)

//async operation - model.method
await Task.deleteMany({}); // reset, deleting condition empty obj means all
await Task.insertMany(data); // add new data

mongoose.connection.close()