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
          <select class="campoEdicao">
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

      // Evento para editar o campo selecionado
      const livroModificado = { ...livro }; // Clonar livro para edição
      listItem.querySelector('.campoEdicao').addEventListener('change', function() {
        const campo = this.value;
        const spanSelecionado = listItem.querySelector(`.${campo}`);

        if (spanSelecionado) {
          const novoValor = prompt(`Edite ${campo}:`, campo === "avaliacao" ? spanSelecionado.innerText.replace("Avaliação: ", "") : spanSelecionado.innerText);
          if (novoValor !== null) {
            spanSelecionado.innerText = campo === "avaliacao" ? `Avaliação: ${novoValor}` : novoValor.toUpperCase();
            livroModificado[campo] = novoValor; // Atualizar valor no clone
          }
        }
      });

      // Evento para salvar alterações no servidor
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
            catalogoLivros[index] = { ...livroModificado };
            listarLivros(filtro); // Atualiza a lista para refletir as mudanças
          } else {
            console.error("Erro ao salvar as alterações");
          }
        } catch (error) {
          console.error("Erro ao salvar o livro:", error);
        }
      });

      // Evento para excluir o livro
      listItem.querySelector('.delete').addEventListener('click', async function() {
        const confirmDelete = confirm("Tem certeza de que deseja excluir este livro?");
        if (confirmDelete) {
          try {
            const response = await fetch(`http://localhost:3000/livros/${livro.id}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              catalogoLivros.splice(index, 1);
              listarLivros();
              alert("Livro excluído com sucesso!");
            } else {
              console.error("Erro ao excluir o livro");
            }
          } catch (error) {
            console.error("Erro ao excluir o livro:", error);
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
