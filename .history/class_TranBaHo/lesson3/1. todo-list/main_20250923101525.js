var todoList = [
  'Vệ sinh cá nhân',
  'Ăn sáng',
  'Tắm rửa',
  'Đi học',
  'Làm bài tập',
  'Đá bóng',
];

const addTodo = (todo) => {
  todoList.push(todo);
  console.log(todoList);
};
addTodo();

const renderTodoList = () => {
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
