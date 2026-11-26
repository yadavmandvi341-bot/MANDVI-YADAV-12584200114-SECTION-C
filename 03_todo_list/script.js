const form = document.getElementById('todo-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

let tasks = [
  { id: 1, text: 'Revise Express.js RESTful Routing', completed: false },
  { id: 2, text: 'Practice Java DSA Linked List Problems', completed: true },
  { id: 3, text: 'Prepare Full Stack Lab File for Exam', completed: false }
];

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');

    const left = document.createElement('div');
    left.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      tasks[index].completed = checkbox.checked;
      renderTasks();
    });

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    left.appendChild(checkbox);
    left.appendChild(span);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const upBtn = document.createElement('button');
    upBtn.className = 'btn-up';
    upBtn.textContent = 'Up';
    upBtn.disabled = index === 0;
    upBtn.addEventListener('click', () => {
      if (index > 0) {
        [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]];
        renderTasks();
      }
    });

    const downBtn = document.createElement('button');
    downBtn.className = 'btn-down';
    downBtn.textContent = 'Down';
    downBtn.disabled = index === tasks.length - 1;
    downBtn.addEventListener('click', () => {
      if (index < tasks.length - 1) {
        [tasks[index + 1], tasks[index]] = [tasks[index], tasks[index + 1]];
        renderTasks();
      }
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-del';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      renderTasks();
    });

    actions.appendChild(upBtn);
    actions.appendChild(downBtn);
    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  tasks.push({ id: Date.now(), text: value, completed: false });
  input.value = '';
  renderTasks();
});

renderTasks();
