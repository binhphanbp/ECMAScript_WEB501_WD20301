let todoList = [
  'Vệ sinh cá nhân',
  'Ăn sáng',
  'Tắm rửa',
  'Đi học',
  'Làm bài tập',
  'Đá bóng',
];

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const listEl = document.getElementById('todo-list');
const countEl = document.getElementById('todo-count');
const emptyStateEl = document.getElementById('empty-state');

const renderTodoList = () => {
  // Xoá nội dung cũ
  listEl.innerHTML = '';

  if (todoList.length === 0) {
    emptyStateEl.style.display = 'block';
    countEl.textContent = '0';
    return;
  }

  emptyStateEl.style.display = 'none';
  countEl.textContent = todoList.length;

  todoList.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = index;

    li.innerHTML = `
        <div class="todo-left">
          <div class="todo-handle" aria-hidden="true">${index + 1}</div>
          <div class="todo-text">${todo}</div>
        </div>
        <div class="todo-actions">
          <button class="todo-delete" type="button" aria-label="Xóa todo">Xóa</button>
        </div>
      `;

    // Gắn sự kiện xóa
    li.querySelector('.todo-delete').addEventListener('click', () => {
      deleteTodo(index);
    });

    listEl.appendChild(li);
  });
};

// Thêm todo
const addTodo = (todo) => {
  if (typeof todo !== 'string') return;
  const trimmed = todo.trim();
  if (trimmed === '') return;
  if (todoList.includes(trimmed)) {
    alert('❗ Todo này đã tồn tại');
    return;
  }
  todoList.push(trimmed);
  renderTodoList();
};

// Xóa todo theo index
const deleteTodo = (index) => {
  todoList.splice(index, 1);
  renderTodoList();
};

// Sự kiện submit form
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(input.value);
  input.value = '';
  input.focus();
});

// Khởi tạo render
renderTodoList();
