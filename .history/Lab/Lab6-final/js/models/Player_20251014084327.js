// js/models/Player.js
import Person from './Person.js'; // Import class cha

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
    // Gọi constructor của class cha (Person)
    super(name, birthYear, hometown);

    this.jerseyNumber = jerseyNumber;
    this.position = position;
    this.goals = goals;
    this.isBallonDorWinner = isBallonDorWinner; // Cầu thủ có phải quả bóng vàng không
  }

  // Ghi đè phương thức getInfo của cha để thêm thông tin cầu thủ
  getInfo() {
    const personInfo = super.getInfo();
    return `${personInfo}\nSố áo: ${this.jerseyNumber}, Vị trí: ${this.position}, Số bàn thắng: ${this.goals}`;
  }

  // Kiểm tra có phải quả bóng vàng không
  isGoldenBallWinner() {
    return this.isBallonDorWinner;
  }

  // Lấy vị trí
  getPosition() {
    return this.position;
  }

  // Lấy số bàn thắng
  getGoals() {
    return this.goals;
  }
}

// Export class để file khác có thể import
export default Player;
