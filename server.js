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

app.put('/livros/:id', (req, res) => {
  const livroId = req.params.id; // Obtém o ID do livro a ser atualizado a partir da URL
  const livroAtualizado = req.body; // Dados atualizados do livro

  // Encontra o índice do livro com o ID especificado
  const index = livros.findIndex(livro => livro.id == livroId);

  if (index !== -1) {
    // Atualiza o livro no array com os novos dados
    livros[index] = { ...livros[index], ...livroAtualizado };

    salvarLivros(); // Salva o catálogo atualizado no arquivo

    res.status(200).json({ message: 'Livro atualizado com sucesso!' });
  } else {
    // Caso o livro com o ID especificado não seja encontrado
    res.status(404).json({ message: 'Livro não encontrado!' });
  }
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
