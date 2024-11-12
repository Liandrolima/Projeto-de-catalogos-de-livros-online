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

function listarLivros(filtro = '') {
  const catalogoList = document.querySelector('#catalogoList');
  catalogoList.innerHTML = '';

  catalogoLivros
    .filter(livro => livro.titulo.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((livro, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = ` 
      <h2 id="catalogo">Livros no Catálogo:</h2>
       <li class="livro-item">
        <div class="livro-info">
          <span class="titulo"><STRONG>TÍTULO:</STRONG> <em>${livro.titulo}</em></span>
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
      </li>

      `;

      let livroModificado = { ...livro }; // clone para editar sem afetar diretamente o catálogo

      listItem.querySelector('.tarefa').addEventListener('change', function() {
        const selectedStatus = this.value;
        let targetValue;
      
        // Seleciona o valor correspondente do livro
        switch (selectedStatus) {
          case 'titulo':
            targetValue = livro.titulo;
            break;
          case 'autor':
            targetValue = livro.autor;
            break;
          case 'genero':
            targetValue = livro.genero;
            break;
          case 'ano':
            targetValue = livro.ano;
            break;
          case 'avaliacao':
            targetValue = livro.avaliacao;
            break;
          default:
            return; // Caso nenhum valor válido seja selecionado
        }
      
        // Solicita ao usuário para editar o valor correspondente
        //const newText = prompt(`Edite ${selectedStatus}:`, targetValue);

        let newText;
        if (selectedStatus === 'avaliacao') {
          // Cria um elemento de select com opções de avaliação
          newText = prompt(`Para Avaliar o livro escolha: RUIM, BOM, ÓTIMO, EXCELENTE`, targetValue);
          
          // Aqui você pode garantir que o valor seja uma das opções válidas
          if (!['RUIM', 'BOM', 'ÓTIMO', 'EXCELENTE'].includes(newText)) {
            alert('Avaliação inválida. Por favor, escolha entre: RUIM, BOM, ÓTIMO, EXCELENTE');
            newText = prompt(`Para Avaliar o livro escolha: RUIM, BOM, ÓTIMO, EXCELENTE`, targetValue);
            
          }
        } else {
          // Para os outros campos, usa-se o prompt padrão
          newText = prompt(`Edite ${selectedStatus}:`, targetValue);
          // Converte a entrada para maiúsculas
          newText = newText ? newText.toUpperCase() : '';
        }
      
        // Atualiza o valor do livro com o que foi editado
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
      
      // Adicionando evento para salvar as alterações
      listItem.querySelector('.save').addEventListener('click', async function() {
        try {
          // Clona o livro para evitar alterações diretamente no objeto original
          const livroModificado = { ...livro }; 
      
          const response = await fetch(`http://localhost:3000/livros/${livro.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(livroModificado), // Envia o livro modificado
          });
      
          if (response.ok) {
            alert("Alterações salvas com sucesso!");
            // Atualiza o catálogo com o livro modificado
            catalogoLivros[index] = { ...livroModificado };
            listarLivros(filtro); // Atualiza a lista para refletir as mudanças
          } else {
            console.error("Erro ao salvar as alterações");
          }
        } catch (error) {
          console.error("Erro ao salvar o livro:", error);
        }
      });
      
      // Evento para excluir livro
      listItem.querySelector('.delete').addEventListener('click', async function() {
        const confirmDelete = confirm("Tem certeza de que deseja excluir este livro?");
        if (confirmDelete) {
          try {
            const response = await fetch(`http://localhost:3000/livros/${livro.id}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              alert("Livro excluído com sucesso!");
              catalogoLivros.splice(index, 1); // Remove o livro do frontend
              listarLivros(filtro); // Atualiza a lista para refletir a exclusão
            } else {
              const errorMsg = await response.text();
              console.error("Erro ao excluir o livro:", errorMsg);
            }
          } catch (error) {
            console.error('Erro ao excluir o livro:', error);
          }
        }
      });

      catalogoList.appendChild(listItem);
    });
}

document.querySelector('#exibirLivrosBtn').addEventListener('click', () => {
  listarLivros();
});

document.querySelector('#buscarLivrosBtn').addEventListener('click', () => {
  const filtro = document.querySelector('#buscaInput').value;
  listarLivros(filtro);
});

carregarCatalogo();
carregarCatalogo().then(() => listarLivros());

