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
