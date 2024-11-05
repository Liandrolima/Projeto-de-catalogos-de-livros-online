const catalogoLivros = [];

async function carregarCatalogo() {
  try {
    const response = await fetch('http://localhost:3000/livros');
    const livros = await response.json();
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
    alert('O livro já está no catálogo!');
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
        <span class="titulo">${livro.titulo.toUpperCase()}</span>
        <span class="autor">${livro.autor.toUpperCase()}</span>
        <span class="genero">${livro.genero.toUpperCase()}</span>
        <span class="ano">${livro.ano}</span>
        <span class="avaliacao">Avaliação: ${livro.avaliacao}</span>
        <div>
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
      `;

      let livroModificado = { ...livro }; // clone para editar sem afetar diretamente o catálogo

      listItem.querySelector('.tarefa').addEventListener('change', function() {
        const selectedStatus = this.value;
        let targetSpan;

        switch (selectedStatus) {
          case "titulo":
            targetSpan = listItem.querySelector('.titulo');
            break;
          case "autor":
            targetSpan = listItem.querySelector('.autor');
            break;
          case "genero":
            targetSpan = listItem.querySelector('.genero');
            break;
          case "ano":
            targetSpan = listItem.querySelector('.ano');
            break;
          case "avaliacao":
            targetSpan = listItem.querySelector('.avaliacao');
            break;
        }

        if (targetSpan) {
          const newText = prompt(`Edite ${selectedStatus}:`, targetSpan.innerText);
          if (newText !== null) {
            targetSpan.innerText = (selectedStatus === "avaliacao" ? `Avaliação: ${newText}` : newText.toUpperCase());
            livroModificado[selectedStatus] = newText;
          }
        }
      });

      // Adicionando evento para salvar as alterações
      listItem.querySelector('.save').addEventListener('click', async function() {
        try {
          const response = await fetch(`http://localhost:3000/livros/${livro.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(livroModificado),
          });

          if (response.ok) {
            alert("Alterações salvas com sucesso!");
            // Atualize o catalogoLivros com o novo livro modificado
            catalogoLivros[index] = { ...livroModificado };
            listarLivros(filtro); // Atualiza a lista para refletir as mudanças
          } else {
            console.error("Erro ao salvar as alterações");
          }
        } catch (error) {
          console.error("Erro ao salvar o livro:", error);
        }
      });

      listItem.querySelector('.delete').addEventListener('click', function() {
        const confirmDelete = confirm("Tem certeza de que deseja excluir este livro?");
        if (confirmDelete) {
          catalogoLivros.splice(index, 1);
          listarLivros();
          alert("Livro excluído com sucesso!");
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
