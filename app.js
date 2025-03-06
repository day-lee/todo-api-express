import express from "express";
import mongoose from "mongoose";
import Task from "./models/Task.js";

//mongoose.connect(DATABASE_URL).then(() => console.log("Connected to DB"));
// const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/myDatabase';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB Connection failed:', err));


const app = express();
app.use(express.json()); // parsing: json -> js obj

/*
try catch handler

higher order function: getting func as arguments and returns function
adding error handling to handler function => (async (req, res) => {...})  
400: bad request by user
404: page not found 
500: server error
*/
function asyncHandler(handler) {
    return async function (req, res) {
        try {
            await handler(req, res)
        } catch(e) {
            if (e.name === 'ValidationError') {
                res.status(400).send({message: e.message})
            } else if (e.name === 'CastError') {
                res.status(404).send({message: "cannot find given id."})
            } else {
                res.status(500).send({message: e.message})
            }
        }
    }
} 

app.get("/hi", (req, res) => {
  res.send("hi");
});

app.get("/tasks", async (req, res) => {
  /*
    "res" takes arguments and converts js object to json
    Content-Type: application/json  

    query parameter: following '?' in the url
     sort: oldest
     count: show how many 

     mongoose는 데이터 찾기, await는 결과 받아옴 
     https://mongoosejs.com/docs/queries.html 찾기
     https://mongoosejs.com/docs/api/query.html 조건 
    */
  const sort = req.query.sort;
  const count = Number(req.query.count) || 0
  const sortOption = {createdAt: sort === 'oldest' ? 'asc': 'desc'}
  
  const tasks = await Task.find().sort(sortOption).limit(count) // all data meeting conditions

  res.send(tasks);
});

// dynamic property name -> :id (with colon)
app.get("/tasks/:id", async (req, res) => {
  /*
    url parameter passed as params object 
    default type is string but convert it to number
    find from tasks mock data that matches id 
  */
  const id = req.params.id;
  const task = await Task.findById(id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: "cannot find given id." });
  } // no matching id exists. status code and msg
});

app.post("/tasks", async (req, res) => {
    /*
    validation is added in the models schema
    when validation doesn't pass, server will die.
    비동기 오류 async error 
    We need a logic for error handling so server will keep connected
    */
  const newTask = await Task.crate(req.body)
  res.status(201).send(newTask);
});

app.patch("/tasks/:id", async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
  if (task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });
    await task.save() // save to mongoDB
    res.send(task);
  } else {
    res.status(404).send({ message: "cannot find given id." });
  }
});

app.delete("/tasks/:id", asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const task = await Task.findByIdAndDelete(id)
  if (task) {
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: "cannot find given id." });
  }
}));

app.listen(3000, () => console.log("Server started."));
