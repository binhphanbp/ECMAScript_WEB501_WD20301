// js/models/PlayerModels.js

class Person {
  constructor(name, age, hometown) {
    this.name = name;
    this.age = age;
    this.hometown = hometown;
  }

  getInfo() {
    return `Tên: ${this.name}, Tuổi: ${this.age}, Quê quán: ${this.hometown}`;
  }

  getAge() {
    return this.age;
  }

  getHometown() {
    return this.hometown;
  }

  setHometown(newHometown) {
    this.hometown = newHometown;
  }
}

class Player extends Person {
  constructor(
    id,
    name,
    age,
    hometown,
    shirtNumber,
    position,
    goals,
    isGoldenBall = false
  ) {
    super(name, age, hometown);
    this.id = id;
    this.shirtNumber = shirtNumber;
    this.position = position;
    this.goals = goals;
    this.isGoldenBall = isGoldenBall;
  }

  // Ghi đè phương thức getInfo để có thông tin đầy đủ hơn
  getInfo() {
    const personalInfo = super.getInfo();
    return `${personalInfo}, Số áo: ${this.shirtNumber}, Vị trí: ${this.position}, Bàn thắng: ${this.goals}`;
  }
}

// Export cả hai class để main.js có thể sử dụng
export { Person, Player };
