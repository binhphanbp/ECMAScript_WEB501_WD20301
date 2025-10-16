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

  // Tính tuổi dựa trên năm sinh, giúp thông tin luôn chính xác
  getAge() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.birthYear;
  }

  getHometown() {
    return this.hometown;
  }

  // Đổi quê quán
  setHometown(newHometown) {
    this.hometown = newHometown;
  }
}

class Player extends Person {
  constructor(name, birthYear, hometown, jerseyNumber, position, goals) {
    // Gọi constructor của class cha (Person)
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

  // Ghi đè phương thức getInfo() để thêm thông tin của cầu thủ
  getInfo() {
    const baseInfo = super.getInfo();
    return `${baseInfo}, Jersey: #${this.jerseyNumber}, Position: ${this.position}, Goals: ${this.goals}`;
  }
}

// Export cả hai class để file khác có thể import
export { Person, Player };
