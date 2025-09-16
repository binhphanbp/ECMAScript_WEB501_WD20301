const arr1 = [1, 2, 3, 4, 5];
arr1[5] = 10;
console.log(arr1);

console.log(typeof arr1); // object
arr1.push(7); // Thêm phần tử vào cuối mảng
arr1.unshift(0); // Thêm phần tử vào đầu mảng
console.log(arr1.pop()); // Xoá và lấy phần tử cuối mảng
console.log(arr1);
