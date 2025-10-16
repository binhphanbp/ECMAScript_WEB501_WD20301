class Person {
  constructor(name, age, hometown) {
    this.name = name;
    this.age = age;
    this.hometown = hometown;
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
    this.yellowCards = yellowCards;
    this.redCards = redCards;
  }
}

export { Person, Player };
