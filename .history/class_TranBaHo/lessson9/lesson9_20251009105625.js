class Human {
  constructor(name, age, address) {
    this.name = name;
    this.age = age;
    this.address = address;
  }

  getInfo = () =>
    `Name: ${this.name}, Age: ${this.age}, Address: ${this.address}`;
  getAge = () => this.age;
  getAddress = () => this.address;
  setAddress = (newAddress) => (this.address = newAddress);
}

class Player extends Human {
  constructor(
    name,
    age,
    address,
    shirtNumber,
    position,
    goals,
    isGoldenBall = false
  ) {
    super(name, age, address);
    this.shirtNumber = shirtNumber;
    this.position = position;
    this.goals = goals;
    this.isGoldenBall = isGoldenBall;
  }

  goldenBall = () => `${this.name} has won the Golden Ball award`;
  getPosition = () => this.position;
  getGoals = () => this.goals;
  setGoals = (newGoals) => (this.goals = newGoals);
  setPosition = (newPosition) => (this.position = newPosition);
  setGoldenBall = (status) => (this.isGoldenBall = status);

  getInfo = () => {
    return `Số ${this.shirtNumber} - ${this.name} (${this.age} tuổi) - ${
      this.position
    }
      Address: ${this.address} -  Goals: ${this.goals} ${
      this.isGoldenBall ? '- GOLDEN BALL' : ''
    }`;
  };
}

let players = [
  new Player('Đồng Tài Đức', 28, 'Hanoi', 10, 'Striker', 25, true),
  new Player('Nguyễn Văn Dũng', 24, 'Danang', 7, 'Midfielder', 10),
  new Player('Hoàng Quốc Huy', 30, 'Hue', 1, 'Goalkeeper', 0),
  new Player('Phan Đức Bình', 21, 'Saigon', 10, 'Striker', 18),
];

const addPlayer = (player) => {
  players.push(player);
};

const showAllPlayers = () => {
  console.log('PLAYER LIST:');
  players.forEach((p) => console.log(p.getInfo()));
};

const updatePlayerAddress = (name, newAddress) => {
  const player = players.find((p) => p.name === name);
  if (player) {
    player.setAddress(newAddress);
    console.log(`Updated address for ${name} to ${newAddress}`);
  } else {
    console.log('Player not found');
  }
};

const deletePlayer = (name) => {
  const index = players.findIndex((p) => p.name === name);
  if (index !== -1) {
    players.splice(index, 1);
    console.log(` Deleted player ${name}`);
  } else {
    console.log(' Player not found');
  }
};

const showPlayerInfo = (name) => {
  const player = players.find((p) => p.name === name);
  console.log(player ? player.getInfo() : ' Player not found');
};

const getPlayerDetails = (name) => {
  const player = players.find((p) => p.name === name);
  if (player) {
    console.log(`Address: ${player.getAddress()}, Age: ${player.getAge()}`);
  } else {
    console.log('Player not found');
  }
};

const editPlayerAddress = (name, newAddress) =>
  updatePlayerAddress(name, newAddress);

const findGoldenBallPlayer = () => players.filter((p) => p.isGoldenBall);

const findStrikers = () =>
  players.filter((p) => p.position.toLowerCase() === 'striker');

const findTopScorer = () => {
  const maxGoals = Math.max(...players.map((p) => p.goals));
  return players.filter((p) => p.goals === maxGoals);
};

//  Tổng số bàn thắng toàn đội
const totalGoals = () => players.reduce((sum, p) => sum + p.goals, 0);

//  Tìm cầu thủ lớn tuổi nhất
const oldestPlayer = () => {
  const maxAge = Math.max(...players.map((p) => p.age));
  return players.filter((p) => p.age === maxAge);
};

// 📊 Đếm số cầu thủ theo vị trí
const countByPosition = () => {
  return players.reduce((acc, p) => {
    acc[p.position] = (acc[p.position] || 0) + 1;
    return acc;
  }, {});
};

// ===============================

showAllPlayers();

console.log("\n Hiển thị thông tin cầu thủ 'Nguyen Van A':");
showPlayerInfo('Nguyen Van A');

console.log('\n Lấy chi tiết tuổi và quê:');
getPlayerDetails('Nguyen Van A');

console.log('\n Sửa quê quán:');
editPlayerAddress('Tran Van B', 'Haiphong');

console.log('\n Cầu thủ Quả Bóng Vàng:');
console.log(findGoldenBallPlayer().map((p) => p.getInfo()));

console.log('\n Cầu thủ ở vị trí Tiền đạo:');
console.log(findStrikers().map((p) => p.getInfo()));

console.log('\n Cầu thủ có số bàn thắng lớn nhất:');
console.log(findTopScorer().map((p) => p.getInfo()));

// console.log('\n Tổng số bàn thắng của đội:', totalGoals());

// console.log('\n Cầu thủ lớn tuổi nhất:');
// console.log(oldestPlayer().map((p) => p.getInfo()));

// console.log('\n Số lượng cầu thủ theo vị trí:');
// console.log(countByPosition());

addPlayer(new Player('Nguyễn Trọng Nguyên', 21, 'Nam Dinh', 11, 'Defender', 3));
console.log('\n After adding a new player:');
showAllPlayers();

deletePlayer('Đồng Tài Đức');
console.log('\n After deletion:');
showAllPlayers();
