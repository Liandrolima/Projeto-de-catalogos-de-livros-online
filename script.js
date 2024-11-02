document.querySelector('#taskForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const taskTitulo = document.querySelector('#taskTitulo');
  const taskAutor = document.querySelector('#taskAutor');
  const taskGenero = document.querySelector('#taskGenero');
  const taskAno = document.querySelector('#taskAno');
  const taskList= document.querySelector('#taskList');

  // Criar um novo item de tarefa
  const newTask = document.createElement('li');
  newTask.style.borderRadius = "10px";
  newTask.innerHTML = `
    <span>${taskTitulo.value.toUpperCase()}</span>
    <span>${taskAutor.value.toUpperCase()}</span>
    <span>${taskGenero.value.toUpperCase()}</span>
    <span>${taskAno.value.toUpperCase()}</span>
    <div>
      <button class="edit">Editar Tarefa</button>    
  
  <select class="delete">
  <option value="delete">Excluir Tarefa</option>
      <option value="excluir">Tem Certeza</option>
      <option value="no">Não excluir tarefa</option>
  </select>
      
    </div>
  `;

  // Adicionar eventos para os botões de editar e excluir
  newTask.querySelector('.edit').addEventListener('click', function() {
      const currentText = newTask.querySelector('span').innerText;        
      const taskText = prompt('Edite a tarefa:', currentText); // Edita o texto da tarefa existente        
      if (taskText !== null) {
        newTask.querySelector('span').innerText = taskText.toUpperCase();                    
      }
    });
  
  /*newTask.querySelector('.tarefa').addEventListener('change', function() {
      const selectedStatus = this.value; // Pega o valor da opção selecionada
      const taskText = newTask.querySelector('span');
      if (selectedStatus === "iniciar") {
        taskText.style.color = "blue"; // Muda a cor do select se "Iniciar" for selecionado
      } else if (selectedStatus === "ocorrendo") {
        taskText.style.color = "orange"; // Muda para cor laranja se "Em processo" for selecionado
      } else if (selectedStatus === "concluida") {
        taskText.style.color = "green"; // Muda para cor verde se "Concluída" for selecionado
      } else if (selectedStatus === "status") {
        taskText.style.color = "black";
      }
  });*/
  
  
   
  newTask.querySelector('.delete').addEventListener('click', function() {
    const confirmDelete = confirm("Tem certeza de que deseja excluir esta tarefa?");
    if (confirmDelete) {
      newTask.remove();
      alert("Tarefa excluída com sucesso!");
    } else {
      alert("Tranquilo, tarefa não será excluída.");
    }
});


  // Adicionar a nova tarefa à lista
  taskList.appendChild(newTask);

  // Limpar o campo de entrada
  taskTitulo.value = '';
  taskAutor.value = '';
  taskGenero.value = '';
  taskAno.value = '';
});


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('mensagem').innerHTML = 'Jesus só salva se renunciar!'
});
