async function listarLivros() {
  try {
    const response = await fetch('http://localhost:3000/livros');
    const livros = await response.json();

    const catalogoList = document.getElementById('catalogoList');
    catalogoList.innerHTML = ''; // Limpa a lista antes de exibir

    livros.forEach(livro => {
      const li = document.createElement('li');
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
            
            <input type="text" class="edit-input" placeholder="Novo valor" style="display: none;">
            <button class="save" style="display: none;">Salvar Alterações</button>
            <button class="delete">Excluir Livro</button>
          </div>
        </div>
      `;

      const select = li.querySelector('.tarefa');
      const input = li.querySelector('.edit-input');
      const saveButton = li.querySelector('.save');
      const deleteButton = li.querySelector('.delete');

      // Mostrar o campo de entrada e o botão de salvar quando um campo for selecionado
      select.addEventListener('change', function() {
        const selectedStatus = this.value;
        let targetValue;

        // Define o valor correspondente com base no campo selecionado
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

        let newText;

        if (selectedStatus === 'avaliacao') {
          // Solicita ao usuário para avaliar o livro com opções específicas
          newText = prompt(`Para Avaliar o livro escolha: RUIM, BOM, ÓTIMO, EXCELENTE`, targetValue);

          // Valida a entrada e repete o prompt se necessário
          while (!['RUIM', 'BOM', 'ÓTIMO', 'EXCELENTE'].includes(newText?.toUpperCase())) {
            alert('Avaliação inválida. Por favor, escolha entre: RUIM, BOM, ÓTIMO, EXCELENTE');
            newText = prompt(`Para Avaliar o livro escolha: RUIM, BOM, ÓTIMO, EXCELENTE`, targetValue);
          }
        } else {
          // Para os outros campos, solicita uma entrada padrão
          newText = prompt(`Edite ${selectedStatus}:`, targetValue);
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
              livro.avaliacao = newText.toUpperCase(); // Converte a avaliação para maiúsculas
              break;
          }

          saveButton.style.display = 'inline'; // Mostra o botão de salvar
        }
      });

      // Função para salvar alterações
      saveButton.addEventListener('click', async function() {
        try {
          // Atualiza o objeto `livro` com os novos valores
          const livroModificado = { ...livro };

          const response = await fetch(`http://localhost:3000/livros/${livro.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(livroModificado), // Envia o objeto livro atualizado
          });

          if (response.ok) {
            alert("Alterações salvas com sucesso!");
            listarLivros(); // Atualiza a lista para refletir as mudanças
          } else {
            alert("Erro ao salvar as alterações.");
          }
        } catch (error) {
          console.error("Erro ao salvar o livro:", error);
        }
      });

      // Função para excluir livro
      deleteButton.addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja excluir este livro?')) {
          try {
            await fetch(`http://localhost:3000/livros/${livro.id}`, {
              method: 'DELETE'
            });
            alert('Livro excluído com sucesso!');
            listarLivros(); // Atualiza a lista após a exclusão
          } catch (error) {
            console.error('Erro ao excluir o livro:', error);
          }
        }
      });

      catalogoList.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao buscar os livros:', error);
  }
}

// Executa a função quando a página for carregada
listarLivros();
