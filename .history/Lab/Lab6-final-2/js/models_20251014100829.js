// js/models.js

class Person {
  constructor(name, birthYear, hometown) {
    this.name = name;
    this.birthYear = birthYear;
    this.hometown = hometown;
  }

  getInfo() {
    return `Name: ${this.name}, Age: ${this.getAge()}, Hometown: ${
      this.hometown
    }`;
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
  }
}

class Player extends Person {
  constructor(name, birthYear, hometown, jerseyNumber, position, goals) {
    super(name, birthYear, hometown);

    this.jerseyNumber = jerseyNumber;
    this.position = position;
    this.goals = goals;
  }

  getPosition() {
    return this.position;
  }

  getJerseyNumber() {
    return this.jerseyNumber;
  }

  getGoals() {
    return this.goals;
  }

  getInfo() {
    const baseInfo = super.getInfo();
    return `${baseInfo}, Jersey: #${this.jerseyNumber}, Position: ${this.position}, Goals: ${this.goals}`;
  }
}

// Export cả hai class
export { Person, Player };
