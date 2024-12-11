const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Para lidar com JSON no corpo das requisições

// Função para ler o arquivo de tarefas
const getTasksFromFile = () => {
  try {
    const data = fs.readFileSync('tasks.json');
    return JSON.parse(data);
  } catch (error) {
    return []; // Retorna um array vazio caso o arquivo não exista ou tenha erro
  }
};

// Função para salvar as tarefas no arquivo
const saveTasksToFile = (tasks) => {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
};

// Dados em memória (agora lidos do arquivo JSON)
let tasks = getTasksFromFile();

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
  saveTasksToFile(tasks); // Salvar no arquivo
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
    saveTasksToFile(tasks); // Salvar no arquivo
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Deletar uma tarefa
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== parseInt(id));
  saveTasksToFile(tasks); // Salvar no arquivo
  res.status(204).end();
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
