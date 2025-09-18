//? ------------- forEach -------------
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
