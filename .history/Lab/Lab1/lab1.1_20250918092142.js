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
console.log(result);
