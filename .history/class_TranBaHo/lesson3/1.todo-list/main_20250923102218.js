var todoList = [
  'Vệ sinh cá nhân',
  'Ăn sáng',
  'Tắm rửa',
  'Đi học',
  'Làm bài tập',
  'Đá bóng',
];

const addTodo = (todo) => {
  if (typeof todo !== 'string') return;
  if (todo === '') return;
  if (todoList.includes(todo)) return;
  if (todo) todoList.push(todo);
};
addTodo('Hi');

const renderTodoList = () => {
  if (todoList.length === 0) return;
  todoList.forEach((todo) => {
    console.log(todo);
  });
};
console.log('Todo List hiện tại');
renderTodoList();

const deleteTodo = (index) => {
  todoList.splice(index, 1);
  console.log('Todo List sau khi xóa:');
  renderTodoList();
};
deleteTodo();
