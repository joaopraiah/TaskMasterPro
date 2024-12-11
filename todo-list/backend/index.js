const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Para lidar com JSON no corpo das requisições

// Dados em memória (pode ser substituído por um banco de dados)
let tasks = [
  { id: 1, text: 'Learn React', status: 'to-do' },
  { id: 2, text: 'Setup Backend', status: 'in-progress' },
  { id: 3, text: 'Deploy App', status: 'done' },
];

// Rotas
// Obter todas as tarefas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Criar uma nova tarefa
app.post('/tasks', (req, res) => {
  const { text, status } = req.body;
  const newTask = { id: tasks.length + 1, text, status: status || 'to-do' };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Atualizar uma tarefa
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { text, status } = req.body;
  const task = tasks.find((task) => task.id === parseInt(id));
  if (task) {
    task.text = text || task.text;
    task.status = status || task.status;
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Deletar uma tarefa
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== parseInt(id));
  res.status(204).end();
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
