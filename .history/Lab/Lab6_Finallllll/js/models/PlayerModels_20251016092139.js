// js/models/PlayerModels.js

class Person {
  constructor(name, age, hometown) {
    this.name = name;
    this.age = age;
    this.hometown = hometown;
  }
  // ... các method khác giữ nguyên
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
    isGoldenBall = false,
    yellowCards = 0,
    redCards = 0
  ) {
    super(name, age, hometown);
    this.id = id;
    this.shirtNumber = shirtNumber;
    this.position = position;
    this.goals = goals;
    this.isGoldenBall = isGoldenBall;
    this.yellowCards = yellowCards; // Thêm thẻ vàng
    this.redCards = redCards; // Thêm thẻ đỏ
  }
  // ... các method khác giữ nguyên
}

export { Person, Player };
