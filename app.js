import express from "express";
import tasks from "./data/mock-express.js";
import mongoose from 'mongoose';


mongoose.connect(DATABASE_URL).then(() => console.log('Connected to DB'));
const app = express();
app.use(express.json());
// parsing: json -> js obj
/*
  request content-type : application/json 일 때 
   body 를 파싱해서 json 에서 js obj로 바꿔주고 request의 body property에 담아줌
 */

app.get("/hi", (req, res) => {
  res.send("hi");
});
// get method, url, callback function

app.get("/tasks", (req, res) => {
  /*
    "res" takes arguments and converts js object to json
    Content-Type: application/json  

    query parameter following '?' in the url
     sort: oldest
     count: show how many 
    */

  const sort = req.query.sort;
  const count = Number(req.query.count); // string to number
  // createdAt is Date object
  const compareFn =
    sort === "oldest"
      ? (a, b) => a.createdAt - b.createdAt
      : (a, b) => b.createdAt - a.createdAt;

  let newTasks = tasks.sort(compareFn);
  // tasks is mock-express.js data. objects in array.
  if (count) {
    newTasks = newTasks.slice(0, count);
  }
  // send the mock data as a response
  res.send(newTasks);
});

// dynamic property name -> :id (with colon)
app.get("/tasks/:id", (req, res) => {
  /*
    url parameter passed as params object 
    default type is string but convert it to number
    find from tasks mock data that matches id 
  */
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: "cannot find given id." });
  } // no matching id exists. status code and msg
});

app.post("/tasks", (req, res) => {
  const newTask = req.body;
  //app.use(express.json()) 을 이용해 js obj로 변경해줌
  const ids = tasks.map((task) => task.id);
  newTask.id = Math.max(...ids) + 1;
  newTask.isComplete = false;
  newTask.createdAt = new Date();
  newTask.updatedAt = new Date();
  tasks.push(newTask);
  // add the created data
  res.status(201).send(newTask);
  // as response, return 201 and show the updated data
});

app.patch("/tasks/:id", (req, res) => {
  /*
  grab a existing task
  change the content of the task
 */
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });
    task.updatedAt = new Date();
    res.send(task);
  } else {
    res.status(404).send({ message: "cannot find given id." });
  }
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = tasks.findIndex((task) => task.id === id);
  if (idx >= 0) {
    /*
        delete one that match the index
        successfully deleted, send only code 204 not body
        */
    tasks.splice(idx, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: "cannot find given id." });
  }
});

// listen port 3000 process, once server starts, perform callback
// localhost:3000/hello
app.listen(3000, () => console.log("Server started."));
