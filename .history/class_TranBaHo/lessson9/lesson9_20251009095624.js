class Human {
  constructor(name, age, address) {
    this.name = name;
    this.age = age;
    this.address = address;
  }

  getInfo = () => {
    return `Họ tên: ${this.ten}, Tuổi: ${this.tuoi}, Quê quán: ${this.queQuan}`;
  };

  getAge = () => this.age;

  getAddress = () => this.address;

  setAddress = (newAddress) => {
    this.address = newAddress;
  };
}

class Player extends Human {
  constructor(ten, tuoi, queQuan, soAo, viTri, soBan) {
    super(ten, tuoi, queQuan);
    this.soAo = soAo;
    this.viTri = viTri;
    this.soBan = soBan;
  }

  Quabongvang = () => {
    return `${this.ten} đã giành được Quả Bóng Vàng! 🏅`;
  };

  getViTri = () => this.viTri;

  getSoBan = () => this.soBan;
}

const cauThu1 = new Cauthu('Nguyễn Văn A', 28, 'Hà Nội', 10, 'Tiền đạo', 25);

console.log(cauThu1.getInfo());
console.log(`Vị trí: ${cauThu1.getViTri()}`);
console.log(`Số bàn thắng: ${cauThu1.getSoBan()}`);
console.log(cauThu1.Quabongvang());

cauThu1.setQueQuan('TP. Hồ Chí Minh');
console.log('Sau khi đổi quê:', cauThu1.getQueQuan());

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

  goldenBall = () => {
    return `${this.name} has won the Golden Ball! 🏅`;
  };

  getPosition = () => this.position;

  getGoals = () => this.goals;
}

const player1 = new Player('Nguyen Van A', 28, 'Hanoi', 10, 'Striker', 25);

console.log(player1.getInfo());
console.log(`Position: ${player1.getPosition()}`);
console.log(`Goals: ${player1.getGoals()}`);
console.log(player1.goldenBall());

// 🛠 Change address
player1.setAddress('Ho Chi Minh City');
console.log('After changing address:', player1.getAddress());
