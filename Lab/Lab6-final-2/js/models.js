class Person {
  constructor(name, birthYear, hometown) {
    this.name = name;
    this.birthYear = birthYear;
    this.hometown = hometown;
  }

  getInfo() {
    return `Tên: ${this.name}, Năm sinh: ${this.birthYear}, Quê quán: ${this.hometown}`;
  }

  getAge() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.birthYear;
  }

  getHometown() {
    return this.hometown;
  }

  setHometown(newHometown) {
    this.hometown = newHometown;
    console.log(`${this.name} đã đổi quê quán thành ${this.hometown}.`);
  }
}

class Player extends Person {
  constructor(
    name,
    birthYear,
    hometown,
    jerseyNumber,
    position,
    goals,
    isBallonDorWinner = false
  ) {
    super(name, birthYear, hometown);

    this.jerseyNumber = jerseyNumber;
    this.position = position;
    this.goals = goals;
    this.isBallonDorWinner = isBallonDorWinner;
  }

  getInfo() {
    const personInfo = super.getInfo();
    return `${personInfo}\nSố áo: ${this.jerseyNumber}, Vị trí: ${this.position}, Số bàn thắng: ${this.goals}`;
  }

  isGoldenBallWinner() {
    return this.isBallonDorWinner;
  }

  getPosition() {
    return this.position;
  }

  getGoals() {
    return this.goals;
  }
}

export { Person, Player };
