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
console.log('Caminho do arquivo:', livrosFilePath);

// Função para carregar o catálogo do arquivo JSON
const carregarLivros = () => {
  try {
    if (fs.existsSync(livrosFilePath)) {
      const data = fs.readFileSync(livrosFilePath, 'utf8');
      livros = JSON.parse(data) || [];
    } else {
      fs.writeFileSync(livrosFilePath, JSON.stringify([]), 'utf8');
      livros = [];
    }
    console.log('Livros carregados:', livros); // Verifique se os livros estão sendo carregados corretamente
  } catch (error) {
    console.error('Erro ao carregar o arquivo:', error);
  }
};

// Função para salvar o catálogo no arquivo JSON
const salvarLivros = () => {
  try {
    console.log('Salvando alterações no arquivo...');
    fs.writeFileSync(livrosFilePath, JSON.stringify(livros, null, 2), 'utf8');
    console.log('Arquivo atualizado com sucesso!');
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

// Rota para adicionar um novo livro com verificação de duplicidade
app.post('/livros', (req, res) => {
  const { titulo, autor, ano } = req.body;

  // Verifica se o livro já existe no catálogo
  const livroExistente = livros.find(livro => livro.titulo === titulo && livro.autor === autor && livro.ano === ano);

  if (livroExistente) {
    return res.status(400).json({ message: 'Este livro já existe no catálogo.' });
  }

  // Adiciona um ID único ao novo livro
  const novoLivro = { ...req.body, id: livros.length > 0 ? Math.max(...livros.map(livro => livro.id)) + 1 : 1 };

  livros.push(novoLivro);
  salvarLivros(); // Salva o catálogo no arquivo
  res.status(201).json({ message: 'Livro adicionado com sucesso!' });
});

// Rota para atualizar um livro existente
app.put('/livros/:id', (req, res) => {
  const livroId = parseInt(req.params.id, 10);
  const livroAtualizado = req.body;

  const index = livros.findIndex(livro => livro.id === livroId);

  if (index !== -1) {
    livros[index] = { ...livros[index], ...livroAtualizado };
    salvarLivros(); // Salva o catálogo atualizado no arquivo
    res.status(200).json({ message: 'Livro atualizado com sucesso!' });
  } else {
    res.status(404).json({ message: 'Livro não encontrado!' });
  }
});

// Rota para excluir um livro
app.delete('/livros/:id', (req, res) => {
  const livroId = parseInt(req.params.id, 10);
  console.log('ID recebido para exclusão:', livroId);

  const index = livros.findIndex(livro => livro.id === livroId);

  if (index !== -1) {
    console.log('Livro antes da exclusão:', livros);
    livros.splice(index, 1);
    console.log('Livro depois da exclusão:', livros);
    salvarLivros(); // Salva o array atualizado no arquivo livros.json
    res.status(200).json({ message: 'Livro deletado com sucesso!' });
  } else {
    console.log('Livro não encontrado!');
    res.status(404).json({ message: 'Livro não encontrado!' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
