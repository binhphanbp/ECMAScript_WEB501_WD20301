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
  if (todoList.includes(todo)) console.log('Todo này đã tôn tại');
  todoList.push(todo);
}; //

const renderTodoList = () => {
  if (todoList.length === 0) return;
  todoList.forEach((todo) => {
    console.log(todo);
  }); //
};

const deleteTodo = (index) => {
  todoList.splice(index, 1);
  console.log('------- Todo List sau khi xóa:');
  renderTodoList();
};

// addTodo('Hi');
// renderTodoList();
// deleteTodo(0);
