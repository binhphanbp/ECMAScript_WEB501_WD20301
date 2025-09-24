//? -------- Scope in JavaScript
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
if (true) {
  let localVar2 = 'Tôi là biến lớp dữ liệu';
  console.log(localVar2); // Tôi là biến lớp dữ liệu
}
console.log(localVar2); // localVar is not defined

//? -------- Giá trị nguyên thuỷ
// Gồm: string, number, boolean, null, undefined, object, symbol
let a = 10;
let b = a;
a = 5;
console.log(a); // 5
console.log(b); // 10

//? -------- Reference
let obj1 = { name: 'Cường' };
let obj2 = obj1;
obj1.name = 'Nam';
console.log(obj1); // { name: 'Nam' }
console.log(obj2); // { name: 'Nam' }

// Truyền tham số trong hàm
function updateObj(obj) {
  obj.value = obj.value + 10;
}
let y = { value: 5 };
updateObj(y);
console.log(y); // { value: 15 }
