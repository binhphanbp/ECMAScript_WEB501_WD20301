console.log('----------- Phân biệt: var / let / const -----------');
/**
 ** var / let / const đều là các từ khoá để khai báo biến trong JavaScript
 ** var: được sử dụng trong JavaScript cũ, có phạm vi rộng.
 ** let: có phạm vi hẹp hơn, chỉ tồn tại trong khối code gần nhất
 ** const: hằng số, giống như let nhưng có phạm vi hẹp hơn, không thay đổi được giá trị
 */

var myName1 = 'Phan Đức Bình';
let myName2 = 'Bình Phan';
const myName3 = 'bianbp';

console.log(myName1);
console.log(myName2);
console.log(myName3);

function test() {
  console.log(myName1);
  console.log(myName2);
  console.log(myName3);
}
