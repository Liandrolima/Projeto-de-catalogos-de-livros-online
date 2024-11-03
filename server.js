const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000; // Defina a porta aqui

app.use(cors());
app.use(express.json());

let livros = [];

// Carrega o catálogo do arquivo JSON
app.get('/livros', (req, res) => {
    res.json(livros);
  });

  app.post('/livros', (req, res) => {
    const novoLivro = req.body;
    livros.push(novoLivro);
    res.status(201).json({ message: 'Livro adicionado com sucesso!' });
  });
  
  // Iniciar o servidor
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
