// js/models/PlayerModels.js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
class Player extends Person {
  constructor(id, name, age, shirtNumber, position, goals = 0) {
    super(name, age);
    this.id = id;
    this.shirtNumber = shirtNumber;
    this.position = position;
    this.goals = goals;
  }
}
export { Player };
