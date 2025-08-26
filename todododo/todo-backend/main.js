const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 3000

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:8080', 
  credentials: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/todoapp')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const Todo = mongoose.model('Todo', {
  name: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

app.use(express.json()); // Для парсинга JSON

// Получить все ToDo
app.get('/getToDos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Добавить ToDo
app.post('/addToDo', async (req, res) => {
  const todo = new Todo({ name: req.body.name });
  await todo.save();
  res.status(201).json(todo).end();
});

// Удалить ToDo
app.delete('/deleteToDo/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Обновить ToDo (новая фича!)
app.patch('/updateToDo/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(todo);
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
