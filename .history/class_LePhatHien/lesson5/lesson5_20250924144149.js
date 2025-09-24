// Global Scope
let globalVar = 'Tôi là biến toàn cục';
console.log(globalVar); // Tôi là biến toàn cục

function testFunction() {
  console.log(globalVar); // Tôi là biến toàn cục
}

// Function scope
function testFunction() {
  let localVar = 'Tôi là biến lớp dữ liệu';
  console.log(localVar); // Tôi là biến lớp dữ liệu
}
console.log(localVar); // localVar is not defined

// Block scope: chỉ có let và const có block scope
{
  let localVar2 = 'Tôi là biến lớp dữ liệu';
  console.log(localVar2); // Tôi là biến lớp dữ liệu
}
console.log(localVar2); // localVar is not defined
