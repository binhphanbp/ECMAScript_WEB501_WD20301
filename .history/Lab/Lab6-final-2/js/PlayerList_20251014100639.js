// js/PlayerList.js

class PlayerList {
  constructor(list = []) {
    this.list = list;
  }

  /**
   * Tìm (các) cầu thủ ghi nhiều bàn thắng nhất.
   * Logic này tương ứng với chức năng "quabongvang" của thầy bạn.
   * @returns {Player[]} - Mảng chứa các cầu thủ ghi nhiều bàn nhất.
   */
  findTopScorers() {
    // Lấy danh sách cầu thủ từ thuộc tính list của class
    const playerList = this.list;

    // Kiểm tra nếu danh sách không hợp lệ hoặc rỗng thì trả về mảng rỗng
    if (!Array.isArray(playerList) || playerList.length === 0) {
      return [];
    }

    // 1. Tìm ra số bàn thắng cao nhất
    const maxGoals = Math.max(...playerList.map((player) => player.goals));

    // 2. Lọc ra những cầu thủ có số bàn thắng bằng với số cao nhất đó
    const topScorers = playerList.filter((player) => player.goals === maxGoals);

    return topScorers;
  }

  /**
   * Hiển thị danh sách cầu thủ ra giao diện HTML
   */
  display() {
    const container = document.getElementById('player-cards-container');
    let htmlContent = '';

    this.list.forEach((player) => {
      htmlContent += `
                <div class="bg-white p-4 shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300">
                    <div class="bg-orange-400 w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-xl mb-3 mx-auto">
                        ${player.getJerseyNumber()}
                    </div>
                    <div class="text-center">
                        <p class="font-extrabold text-lg text-gray-800">${
                          player.name
                        }</p>
                        <p class="text-gray-500">${player.position}</p>
                    </div>
                </div>
            `;
    });

    // Gán toàn bộ chuỗi HTML vào container một lần để tối ưu hiệu suất
    container.innerHTML = htmlContent;
  }
}

// Export class để file main.js có thể import
export { PlayerList };
