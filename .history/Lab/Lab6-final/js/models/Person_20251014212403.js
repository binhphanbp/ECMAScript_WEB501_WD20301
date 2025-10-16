class Person {
  constructor(name, birthYear, hometown) {
    this.name = name;
    this.birthYear = birthYear;
    this.hometown = hometown;
  }

  // Lấy thông tin cơ bản
  getInfo() {
    return `Tên: ${this.name}, Năm sinh: ${this.birthYear}, Quê quán: ${this.hometown}`;
  }

  // Lấy tuổi
  getAge() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.birthYear;
  }

  // Lấy quê quán
  getHometown() {
    return this.hometown;
  }

  // Sửa quê quán
  setHometown(newHometown) {
    this.hometown = newHometown;
    console.log(`${this.name} đã đổi quê quán thành ${this.hometown}.`);
  }
}

// Export class để file khác có thể import
export default Person;
