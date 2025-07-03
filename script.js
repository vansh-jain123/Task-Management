const toggle = document.getElementById('modeToggle');
const columns = document.querySelectorAll('.column');
const addTaskBtn = document.querySelector('.add-task');
const modal = document.getElementById('taskModal');
const taskInput = document.getElementById('taskInput');
const columnSelect = document.getElementById('columnSelect');
const confirmBtn = document.getElementById('addTaskBtn');
const cancelBtn = document.getElementById('cancelTaskBtn');

let draggedItem = null;

// Load dark mode preference
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  toggle.checked = true;
}

// Theme toggle
toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Drag & Drop
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();

  columns.forEach(col => {
    col.addEventListener('dragover', e => e.preventDefault());
    col.addEventListener('drop', e => {
      e.preventDefault();
      if (draggedItem) {
        col.appendChild(draggedItem);
        saveTasks();
      }
    });
  });
});

function addDragEvents(card) {
  card.addEventListener('dragstart', () => draggedItem = card);
  card.addEventListener('dragend', () => draggedItem = null);
}

// Save tasks
function saveTasks() {
  const boardData = {};
  columns.forEach(col => {
    const key = col.getAttribute('data-column');
    const tasks = Array.from(col.querySelectorAll('.card')).map(card => card.querySelector('span').textContent);
    boardData[key] = tasks;
  });
  localStorage.setItem('kanbanData', JSON.stringify(boardData));
}

// Load tasks
function loadTasks() {
  const data = JSON.parse(localStorage.getItem('kanbanData'));
  if (!data) return;

  columns.forEach(col => {
    const key = col.getAttribute('data-column');
    col.innerHTML = `<h3>${capitalize(key)}</h3>`;
    data[key].forEach(text => col.appendChild(createCard(text)));
  });
}

// Capitalize
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Create task card
function createCard(text) {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('draggable', true);

  const span = document.createElement('span');
  span.textContent = text;

  const delBtn = document.createElement('button');
  delBtn.textContent = 'x';
  delBtn.onclick = () => {
    card.remove();
    saveTasks();
  };

  card.appendChild(span);
  card.appendChild(delBtn);
  addDragEvents(card);
  return card;
}

// Task modal open
addTaskBtn.onclick = () => modal.style.display = 'flex';
cancelBtn.onclick = () => {
  taskInput.value = '';
  modal.style.display = 'none';
};

// Add task
confirmBtn.onclick = () => {
  const text = taskInput.value.trim();
  const column = columnSelect.value;
  if (text) {
    const col = document.querySelector(`.column[data-column="${column}"]`);
    col.appendChild(createCard(text));
    saveTasks();
  }
  taskInput.value = '';
  modal.style.display = 'none';
};
