const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Todo = require("./model/Todo");

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/todolistDB")
  .then(() => console.log("MongoDB Connected successfully!"))
  .catch((err) => console.log(err));

// GET all tasks
app.get("/todolist", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// POST new task
app.post("/todolist", async (req, res) => {
  const newTodo = new Todo({
    userTask: req.body.userTask,
  });

  await newTodo.save();
  res.json(newTodo);
});

// PUT update task status
app.put("/todolist/:id", async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
});

// DELETE task
app.delete("/todolist/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
