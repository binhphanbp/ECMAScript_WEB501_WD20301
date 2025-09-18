//? ------------- forEach() -------------
//* forEach là phương thức duyệt qua từng phần tử trong mảng
const numberList = [3, 2, 4, 7, 9];
numberList.forEach((number) => console.log(number * 2));

//? In ra bình phương các số
numberList.forEach((number) => console.log(number * number));

//? In ra các số chẵn
numberList.forEach((number) => {
  if (number % 2 === 0) {
    console.log(number);
  }
});

//? In ra các số lớn hơn 5
numberList.forEach((number) => {
  if (number > 5) {
    console.log(number);
  }
});

const users = [
  {
    name: 'Cường',
    age: 21,
  },
  {
    name: 'Name',
    age: 25,
  },
  {
    name: 'Tí',
    age: 10,
  },
];
users.forEach((user) => console.log(`${user.name} có tuổi là ${user.age}`));

//? ------------- filter() -------------
//* filter là phương thức lọc dữ liệu trong mảng và trả về mảng mới thoả điều kiện
//? Lọc ra mảng số chẵn
const newNumbers = numberList.filter((number) => number % 2 === 0);
console.log(newNumbers); // [4, 8]

//? Dùng filter lấy mảng user có tuổi lớn hơn 8
const newUsers = users.filter((user) => user.age > 18);
console.log(newUsers); // [ { name: 'Cường', age: 21 }, { name: 'Name', age: 25 } ]

//? ------------- map() -------------
//* map là phương thức lớp dữ liệu trong mảng và trả về mảng mới
const doubleArr = numberList.map((number) => number * 2);
console.log(doubleArr); // [6, 4, 8, 14, 18]
