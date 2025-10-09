class Human {
  constructor(name, age, address) {
    this.name = name;
    this.age = age;
    this.address = address;
  }

  getInfo = () => {
    return `Họ tên: ${this.ten}, Tuổi: ${this.tuoi}, Quê quán: ${this.queQuan}`;
  };

  getAge = () => this.age;

  getAddress = () => this.address;

  setAddress = (newAddress) => {
    this.address = newAddress;
  };
}

class Cauthu extends ConNguoi {
  constructor(ten, tuoi, queQuan, soAo, viTri, soBan) {
    super(ten, tuoi, queQuan); // Gọi constructor cha
    this.soAo = soAo;
    this.viTri = viTri;
    this.soBan = soBan;
  }

  Quabongvang = () => {
    return `${this.ten} đã giành được Quả Bóng Vàng! 🏅`;
  };

  getViTri = () => this.viTri;

  getSoBan = () => this.soBan;
}

const cauThu1 = new Cauthu('Nguyễn Văn A', 28, 'Hà Nội', 10, 'Tiền đạo', 25);

console.log(cauThu1.getInfo());
console.log(`Vị trí: ${cauThu1.getViTri()}`);
console.log(`Số bàn thắng: ${cauThu1.getSoBan()}`);
console.log(cauThu1.Quabongvang());

cauThu1.setQueQuan('TP. Hồ Chí Minh');
console.log('Sau khi đổi quê:', cauThu1.getQueQuan());
