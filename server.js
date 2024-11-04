const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let livros = [];

// Caminho para o arquivo JSON
const livrosFilePath = path.join(__dirname, 'livros.json');

// Função para carregar o catálogo do arquivo JSON
const carregarLivros = () => {
  try {
    const data = fs.readFileSync(livrosFilePath, 'utf8');
    livros = JSON.parse(data) || [];
  } catch (error) {
    console.error('Erro ao carregar o arquivo:', error);
  }
};

// Função para salvar o catálogo no arquivo JSON
const salvarLivros = () => {
  try {
    fs.writeFileSync(livrosFilePath, JSON.stringify(livros, null, 2), 'utf8');
  } catch (error) {
    console.error('Erro ao salvar no arquivo:', error);
  }
};

// Carrega os livros ao iniciar o servidor
carregarLivros();

// Rota para obter o catálogo de livros
app.get('/livros', (req, res) => {
  res.json(livros);
});

// Rota para adicionar um novo livro
app.post('/livros', (req, res) => {
  const novoLivro = req.body;
  livros.push(novoLivro);
  salvarLivros(); // Salva o catálogo no arquivo
  res.status(201).json({ message: 'Livro adicionado com sucesso!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
