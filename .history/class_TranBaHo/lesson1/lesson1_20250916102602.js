console.log('----------- Phân biệt: var / let / const -----------');
/**
 ** var / let / const đều là các từ khoá để khai báo biến trong JavaScript
 ** var: được sử dụng trong JavaScript cũ, có phạm vi rộng.
 ** let: có phạm vi hẹp hơn, chỉ tồn tại trong khối code gần nhất
 ** const: hằng số, giống như let nhưng có phạm vi hẹp hơn, không thay đổi được giá trị
 */

const myFavorite = ['Javascript', 'ReactJS', 'NextJS', 'NestJS'];
var result = '';

function test(a) {
  for (let i = 0; i < myFavorite.length; i++) {
    const element = myFavorite[i];

    if (element === a) {
      return 'Chung sở thích';
    }
  }
  return result;
}
