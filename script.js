const catalogoLivros = [];

async function carregarCatalogo() {
  try {
    const response = await fetch('http://localhost:3000/livros');
    const livros = await response.json();
    console.log(livros);
    catalogoLivros.push(...livros);
  } catch (error) {
    console.error('Erro ao carregar o catálogo:', error);
  }
}

document.querySelector('#livroForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const titulo = document.querySelector('#livroTitulo').value;
  const autor = document.querySelector('#livroAutor').value;
  const genero = document.querySelector('#livroGenero').value;
  const ano = document.querySelector('#livroAno').value;
  const avaliacao = document.querySelector('#livroAvaliacao').value;

  const livro = { titulo, autor, genero, ano, avaliacao };

  

  const livroExistente = catalogoLivros.some(item => item.titulo === livro.titulo && item.autor === livro.autor);

  if (livroExistente) {
    document.getElementById('mensagem').innerHTML = 'O livro já está no catálogo!!';
    setTimeout(() => {
        document.getElementById('mensagem').innerHTML = '';
    }, 3000); // Limpa a mensagem após 3 segundos

    document.querySelector('#livroTitulo').value = '';
    document.querySelector('#livroAutor').value = '';
    document.querySelector('#livroGenero').value = '';
    document.querySelector('#livroAno').value = '';
    document.querySelector('#livroAvaliacao').value = '';
    return;
}


  catalogoLivros.push(livro);

  try {
    const response = await fetch('http://localhost:3000/livros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(livro),
    });

    if (response.ok) {
      alert('Livro adicionado com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao salvar o livro:', error);
  }

  document.querySelector('#livroForm').reset();
});

async function buscarLivro(filtro = '') {
  const catalogoList = document.querySelector('#catalogoList');
  catalogoList.innerHTML = '';  // Limpa a lista de livros

  if (!filtro.trim()) {
    catalogoList.innerHTML = '<p>Por favor, digite o nome do livro ou do autor para buscar.</p>';
    return;
  }

  // Verifique se o catálogo foi carregado corretamente
  if (catalogoLivros.length === 0) {
    catalogoList.innerHTML = '<p>Não há livros carregados no catálogo.</p>';
    return;
  }

  // Cria uma expressão regular que busca a palavra completa no filtro
  const regex = new RegExp(`\\b${filtro.toLowerCase()}\\b`, 'i'); // 'i' para ignorar maiúsculas/minúsculas

  // Filtra os livros com base no título ou autor
  const livrosFiltrados = catalogoLivros.filter(livro => 
    regex.test(livro.titulo.toLowerCase()) || 
    regex.test(livro.autor.toLowerCase())
  );

  // Se houver livros filtrados, exibe-os
  if (livrosFiltrados.length > 0) {
    livrosFiltrados.forEach((livro, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = ` 
        <li class="livro-item">
          <div class="livro-info">
            <span class="titulo"><strong>TÍTULO:</strong> <em>${livro.titulo.toUpperCase()}</em></span>
            <span class="autor"><strong>AUTOR:</strong> <em>${livro.autor.toUpperCase()}</em></span>
            <span class="genero"><strong>GÊNERO:</strong> <em>${livro.genero.toUpperCase()}</em></span>
            <span class="ano"><strong>ANO:</strong> <em>${livro.ano.toUpperCase()}</em></span>
            <span class="avaliacao"><strong>AVALIAÇÃO:</strong> <em>${livro.avaliacao.toUpperCase()}</em></span>
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
        </li>
      `;

      // Eventos para editar e salvar alterações do livro
      listItem.querySelector('.tarefa').addEventListener('change', function() {
        const selectedStatus = this.value;
        let targetValue;
      
        switch (selectedStatus) {
          case 'titulo':
            targetValue = livro.titulo.toUpperCase();
            break;
          case 'autor':
            targetValue = livro.autor.toUpperCase();
            break;
          case 'genero':
            targetValue = livro.genero.toUpperCase();
            break;
          case 'ano':
            targetValue = livro.ano.toUpperCase();
            break;
          case 'avaliacao':
            targetValue = livro.avaliacao.toUpperCase();
            break;
          default:
            return;
        }

        let newText;
        if (selectedStatus === 'avaliacao') {
          newText = prompt(`Para Avaliar o livro escolha: RUIM, BOM, ÓTIMO, EXCELENTE`, targetValue);
          if (!['RUIM', 'BOM', 'ÓTIMO', 'EXCELENTE'].includes(newText)) {
            alert('Avaliação inválida. Por favor, escolha entre: RUIM, BOM, ÓTIMO, EXCELENTE');
            newText = prompt(`Para Avaliar o livro escolha: RUIM, BOM, ÓTIMO, EXCELENTE`, targetValue);
          }
        } else {
          newText = prompt(`Edite ${selectedStatus}:`, targetValue);
          newText = newText ? newText.toUpperCase() : '';
        }

        if (newText !== null && newText !== '') {
          switch (selectedStatus) {
            case 'titulo':
              livro.titulo = newText;
              break;
            case 'autor':
              livro.autor = newText;
              break;
            case 'genero':
              livro.genero = newText;
              break;
            case 'ano':
              livro.ano = newText;
              break;
            case 'avaliacao':
              livro.avaliacao = newText.toUpperCase();
              break;
          }
        }
      });
      
      listItem.querySelector('.save').addEventListener('click', async function() {
        try {
          const livroModificado = { ...livro }; 
          const response = await fetch(`http://localhost:3000/livros/${livro.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(livroModificado),
          });

          if (response.ok) {
            alert("Alterações salvas com sucesso!");
            catalogoLivros[index] = { ...livroModificado };
            buscarLivro(filtro); // Atualiza a lista
          } else {
            console.error("Erro ao salvar as alterações");
          }
        } catch (error) {
          console.error("Erro ao salvar o livro:", error);
        }
      });

      listItem.querySelector('.delete').addEventListener('click', async function() {
        const confirmDelete = confirm("Tem certeza de que deseja excluir este livro?");
        if (confirmDelete) {
          try {
            const response = await fetch(`http://localhost:3000/livros/${livro.id}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              alert("Livro excluído com sucesso!");
              catalogoLivros.splice(index, 1);
              buscarLivro(filtro); // Atualiza a lista
            } else {
              console.error("Erro ao excluir o livro");
            }
          } catch (error) {
            console.error('Erro ao excluir o livro:', error);
          }
        }
      });

      catalogoList.appendChild(listItem);
    });
  } else {
    catalogoList.innerHTML = '<p>Nenhum livro encontrado.</p>';
  }
}

document.querySelector('#buscarLivroBtn').addEventListener('click', async () => {
  const filtro = document.querySelector('#buscaInput').value;
  
  // Espera o catálogo ser carregado antes de buscar
  if (catalogoLivros.length === 0) {
    await carregarCatalogo(); // Carrega os livros se o catálogo estiver vazio
  }
  
  buscarLivro(filtro); // Realiza a busca após o catálogo estar carregado
});



