class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
class Player extends Person {
  constructor(
    id,
    name,
    age,
    shirtNumber,
    position,
    goals = 0,
    yellowCards = 0,
    redCards = 0,
    isGoldenBall = false
  ) {
    super(name, age);
    this.id = id;
    this.shirtNumber = shirtNumber;
    this.position = position;
    this.goals = goals;
    this.yellowCards = yellowCards;
    this.redCards = redCards;
    this.isGoldenBall = isGoldenBall;
  }
}
export { Player };
