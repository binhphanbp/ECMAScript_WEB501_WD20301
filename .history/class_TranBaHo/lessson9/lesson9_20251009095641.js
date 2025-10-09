// 🔨🤖🔧 Class Human
class Human {
  constructor(name, age, address) {
    this.name = name;
    this.age = age;
    this.address = address;
  }

  // ⚙️ Arrow function methods
  getInfo = () => {
    return `Name: ${this.name}, Age: ${this.age}, Address: ${this.address}`;
  };

  getAge = () => this.age;

  getAddress = () => this.address;

  setAddress = (newAddress) => {
    this.address = newAddress;
  };
}

// ⚽ Class Player kế thừa Human
class Player extends Human {
  constructor(name, age, address, shirtNumber, position, goals) {
    super(name, age, address); // Gọi constructor cha
    this.shirtNumber = shirtNumber;
    this.position = position;
    this.goals = goals;
  }

  // 🏆 Quả bóng vàng
  goldenBall = () => {
    return `${this.name} has won the Golden Ball! 🏅`;
  };

  getPosition = () => this.position;

  getGoals = () => this.goals;
}

// 🧩 Test thử
const player1 = new Player('Nguyen Van A', 28, 'Hanoi', 10, 'Striker', 25);

console.log(player1.getInfo());
console.log(`Position: ${player1.getPosition()}`);
console.log(`Goals: ${player1.getGoals()}`);
console.log(player1.goldenBall());

// 🛠 Change address
player1.setAddress('Ho Chi Minh City');
console.log('After changing address:', player1.getAddress());
