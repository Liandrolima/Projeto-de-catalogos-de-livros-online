async function listarLivros() {
    try {
      const response = await fetch('http://localhost:3000/livros');
      const livros = await response.json();
  
      const catalogoList = document.getElementById('catalogoList');
      catalogoList.innerHTML = ''; // Limpa a lista antes de exibir
  
      livros.forEach(livro => {
        const li = document.createElement('li');
        
        // Definindo o conteúdo HTML corretamente usando innerHTML
        li.innerHTML = `
          <h2 id="catalogo">Livros no Catálogo:</h2>
          <div class="livro-item">
            <div class="livro-info">
              <span class="titulo"><strong>TÍTULO:</strong> <em>${livro.titulo}</em></span>
              <span class="autor"><strong>AUTOR:</strong> <em>${livro.autor}</em></span>
              <span class="genero"><strong>GÊNERO:</strong> <em>${livro.genero}</em></span>
              <span class="ano"><strong>ANO:</strong> <em>${livro.ano}</em></span>
              <span class="avaliacao"><strong>AVALIAÇÃO:</strong> <em>${livro.avaliacao}</em></span>
            </div>
  
            <div class="livro-actions">
              <select class="tarefa">
                <option value="status">Editar Campo</option>
                <option value="titulo">Título</option>
                <option value="autor">Autor</option>
                <option value="genero">Gênero</option>
                <option value="ano">Ano</option>
                <option value="avaliacao">Avaliação</option>
              </select>
              
              <button class="save">Salvar Alterações</button>
              <button class="delete">Excluir Livro</button>
            </div>
          </div>
        `;
        
        catalogoList.appendChild(li);
      });
    } catch (error) {
      console.error('Erro ao buscar os livros:', error);
    }
  }
  
  // Executa a função quando a página for carregada
  listarLivros();

  
  
  