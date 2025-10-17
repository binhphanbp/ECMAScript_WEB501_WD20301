// js/models/PlayerModels.js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class Player extends Person {
  constructor(id, name, age, shirtNumber, position) {
    super(name, age);
    this.id = id;
    this.shirtNumber = shirtNumber;
    this.position = position;
  }
}

export { Player };
