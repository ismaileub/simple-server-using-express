const express = require("express");

const path = require("path");

const fs = require("fs");

const app = express();

const port = 5000;

app.use(express.json()); // Parser middleware

// File path for todos
const filePath = path.join(__dirname, "../../db/todo.json");

// Home route
app.get("/", (req, res) => {
  res.send("I am learning Express.js.");
});

// Get all todos
app.get("/todos", (req, res) => {
  try {
    const data = fs.readFileSync(filePath, { encoding: "utf-8" });
    const todos = JSON.parse(data);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to read todos" });
  }
});

// Create a new todo
app.post("/create-todo", (req, res) => {
  try {
    const { title, body } = req.body;
    const createdAt = new Date().toLocaleString();

    const data = fs.readFileSync(filePath, { encoding: "utf-8" });
    const todos = JSON.parse(data);

    todos.push({ title, body, createdAt });

    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2), {
      encoding: "utf-8",
    });

    res.status(201).json({ title, body, createdAt });
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Get single todo by title
app.get("/todo", (req, res) => {
  try {
    const title = req.query.title;

    const data = fs.readFileSync(filePath, { encoding: "utf-8" });
    const todos = JSON.parse(data);

    const todo = todos.find((t) => t.title === title);

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

// Update todo by title
app.patch("/update-todo", (req, res) => {
  try {
    const title = req.query.title;
    const { body } = req.body;

    const data = fs.readFileSync(filePath, { encoding: "utf-8" });
    const todos = JSON.parse(data);

    const todoIndex = todos.findIndex((t) => t.title === title);

    todos[todoIndex].body = body;

    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2), {
      encoding: "utf-8",
    });

    res.json(todos[todoIndex]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete todo by title
app.delete("/delete-todo", (req, res) => {
  try {
    const title = req.query.title;

    const data = fs.readFileSync(filePath, { encoding: "utf-8" });
    const todos = JSON.parse(data);

    const filteredTodos = todos.filter((t) => t.title !== title);

    fs.writeFileSync(filePath, JSON.stringify(filteredTodos, null, 2), {
      encoding: "utf-8",
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}. http://localhost:${port}`);
});
