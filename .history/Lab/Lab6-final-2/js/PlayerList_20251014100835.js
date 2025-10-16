// js/PlayerList.js

class PlayerList {
  constructor(list = []) {
    this.list = list;
  }

  /**
   * Tìm (các) cầu thủ ghi nhiều bàn thắng nhất.
   * @returns {Player[]} - Mảng chứa các cầu thủ ghi nhiều bàn nhất.
   */
  findTopScorers() {
    const playerList = this.list;
    if (!Array.isArray(playerList) || playerList.length === 0) {
      return [];
    }
    const maxGoals = Math.max(...playerList.map((player) => player.goals));
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
      // Sử dụng các class CSS từ file style.css
      htmlContent += `
                <div class="player-card">
                    <div class="player-card__jersey">
                        ${player.getJerseyNumber()}
                    </div>
                    <div class="player-card__info">
                        <p class="player-card__name">${player.name}</p>
                        <p class="player-card__position">${player.position}</p>
                    </div>
                </div>
            `;
    });

    container.innerHTML = htmlContent;
  }
}

export { PlayerList };
