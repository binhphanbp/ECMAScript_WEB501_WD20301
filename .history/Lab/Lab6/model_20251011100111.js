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

export { Player, Human };
