console.log('----------- Phân biệt: var / let / const -----------');
/**
 ** var / let / const đều là các từ khoá để khai báo biến trong JavaScript
 ** var: được sử dụng trong JavaScript cũ, có phạm vi rộng.
 ** let: có phạm vi hẹp hơn, chỉ tồn tại trong khối code gần nhất
 ** const: hằng số, giống như let nhưng có phạm vi hẹp hơn, không thay đổi được giá trị
 */

const myFavorite = ['Javascript', 'ReactJS', 'NextJS', 'NestJS'];
var result = '';

function checkFavorite(a) {
  for (let i = 0; i < myFavorite.length; i++) {
    const element = myFavorite[i];

    if (element === a) {
      return 'Chung sở thích';
    }
  }
  return 'Không chung sở thích';
}

let b = checkFavorite('NextJS');
result = `Kết quả kiểm tra: ${b}`;
// console.log(result);

const numList = [1, 4, 6, 21, 5, 7];
const checkNum = (number) => {
  for (let i = 0; i < numList.length; i++) {
    const element = numList[i];
    if (element === number) {
      return `${number} có trong danh sách với vị trí index: ${i}`;
    }
    return `${number} không có trong danh sách`;
  }
};
console.log(checkNum(1));
