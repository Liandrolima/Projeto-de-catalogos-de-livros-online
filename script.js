const catalogoLivros = [];

  async function carregarCatalogo() {
    try {
      const response = await fetch('http://localhost:3000/livros');
      const livros = await response.json();
      catalogoLivros.push(...livros);
      listarLivros();
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

  function listarLivros() {
    const catalogoList = document.querySelector('#catalogoList');
    catalogoList.innerHTML = ''; // Limpa a lista antes de atualizar

    // Percorre o array de livros e exibe cada um
    catalogoLivros.forEach((livro, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span class="titulo">${livro.titulo.toUpperCase()}</span>
        <span class="autor">${livro.autor.toUpperCase()}</span>
        <span class="genero">${livro.genero.toUpperCase()}</span>
        <span class="ano">${livro.ano}</span>
        <span class="avaliacao">Avaliação: ${livro.avaliacao}</span>
        <div>
          <!--<button class="edit">Editar Livro</button>--> 
          <select class="tarefa">
            <option value="status">Editar Campo</option>
            <option value="titulo">Título</option>
            <option value="autor">Autor</option>
            <option value="genero">Gênero</option>
            <option value="ano">Ano</option>
            <option value="avaliacao">Avaliação</option>
          </select>      
          <button class="delete">Excluir Livro</button>
        </div>
      `;
      
      // Função de edição
      /*listItem.querySelector('.edit').addEventListener('click', function() {
        const spans = listItem.querySelectorAll('span');
        spans.forEach(span => {
          const currentText = span.innerText;
          const livroText = prompt(`Edite ${span.className}:`, currentText);
          if (livroText !== null) {
            span.innerText = livroText.toUpperCase();
          }
        });
      });*/

      // Alteração de campos específicos e cores
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
            targetSpan.style.color = selectedStatus === "autor" ? "orange" : 
                                      selectedStatus === "genero" ? "green" : 
                                      selectedStatus === "ano" ? "black" : 
                                      selectedStatus === "avaliacao" ? "purple" : "blue";
          }
        }
      });

      // Exclusão de tarefa
      listItem.querySelector('.delete').addEventListener('click', function() {
        const confirmDelete = confirm("Tem certeza de que deseja excluir este livro?");
        if (confirmDelete) {
          catalogoLivros.splice(index, 1); // Remove do array
          listarLivros(); // Atualiza a lista exibida
          alert("Livro excluído com sucesso!");
        }
      });

      catalogoList.appendChild(listItem);
    });
  }


  document.querySelector('#exibirLivrosBtn').addEventListener('click', () => listarLivros());
  document.querySelector('#buscarLivrosBtn').addEventListener('click', () => {
    const filtro = document.querySelector('#buscaInput').value;
    listarLivros(filtro);
  });

  // Carrega o catálogo ao iniciar
  carregarCatalogo();