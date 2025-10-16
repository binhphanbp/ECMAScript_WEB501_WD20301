// js/services/PlayerList.js

export default class PlayerList {
  constructor(initialPlayers = []) {
    this.players = initialPlayers;
    this.nextId =
      this.players.length > 0
        ? Math.max(...this.players.map((p) => p.id)) + 1
        : 1;
  }

  // === PHẦN LOGIC (Tương tự Service cũ) ===

  getAllPlayers() {
    return this.players;
  }

  getPlayerById(id) {
    return this.players.find((player) => player.id === id);
  }

  addPlayer(playerData) {
    const newPlayer = { id: this.nextId++, ...playerData };
    this.players.push(newPlayer);
    this.refreshUI(); // Thêm xong tự động vẽ lại giao diện
  }

  deletePlayer(id) {
    this.players = this.players.filter((player) => player.id !== id);
    this.refreshUI(); // Xóa xong tự động vẽ lại giao diện
  }

  updatePlayer(id, updatedData) {
    this.players = this.players.map((player) =>
      player.id === id ? { ...player, ...updatedData } : player
    );
    this.refreshUI(); // Cập nhật xong tự động vẽ lại giao diện
  }

  // Các hàm filter
  getGoldenBallWinners() {
    return this.players.filter((player) => player.isGoldenBall);
  }

  getTopScorers() {
    if (this.players.length === 0) return [];
    const maxGoals = Math.max(...this.players.map((p) => p.goals));
    return this.players.filter((p) => p.goals === maxGoals);
  }

  // === PHẦN HIỂN THỊ (Tương tự UI cũ, nhưng nằm trong class này) ===

  renderPlayerList(targetElementId) {
    const playerListEl = document.getElementById(targetElementId);
    playerListEl.innerHTML = '';

    this.players.forEach((player) => {
      playerListEl.innerHTML += `
                <li data-id="${player.id}">
                    <div class="player-info">
                        <p>${player.name}</p>
                        <p>${player.position}</p>
                    </div>
                    <div class="player-actions">
                        <i class="fas fa-edit" title="Chỉnh sửa"></i>
                        <i class="fas fa-trash-alt" title="Xóa"></i>
                    </div>
                </li>
            `;
    });
  }

  renderPlayerCards(playersToShow, targetElementId) {
    const playerGridEl = document.getElementById(targetElementId);
    playerGridEl.innerHTML = '';

    if (playersToShow.length === 0) {
      playerGridEl.innerHTML = '<p>Không có cầu thủ nào.</p>';
      return;
    }

    playersToShow.forEach((player) => {
      playerGridEl.innerHTML += `
                <div class="player-card">
                    ${
                      player.isGoldenBall
                        ? '<i class="fas fa-trophy golden-ball-icon"></i>'
                        : ''
                    }
                    <div class="shirt-number">${player.shirtNumber}</div>
                    <h3>${player.name}</h3>
                    <p class="position">${player.position}</p>
                    <div class="stats">
                        <span><strong>Tuổi:</strong> ${player.age}</span>
                        <span><strong>Bàn:</strong> ${player.goals}</span>
                    </div>
                </div>
            `;
    });
  }

  // Hàm tiện ích để cập nhật toàn bộ UI sau mỗi hành động
  refreshUI() {
    this.renderPlayerList('player-list');
    // Giữ nguyên bộ lọc đang active khi refresh
    const activeFilter =
      document.querySelector('.filter-btn.active').dataset.filter;
    this.filterAndRenderCards(activeFilter, 'player-grid');
  }

  // Hàm kết hợp logic filter và render
  filterAndRenderCards(filterType, targetElementId) {
    let playersToShow;
    switch (filterType) {
      case 'forward':
        playersToShow = this.players.filter((p) => p.position === 'Tiền Đạo');
        break;
      case 'golden-ball':
        playersToShow = this.getGoldenBallWinners();
        break;
      case 'top-scorer':
        playersToShow = this.getTopScorers();
        break;
      // Thêm các case khác nếu cần
      // ...
      default:
        playersToShow = this.getAllPlayers();
    }
    this.renderPlayerCards(playersToShow, targetElementId);
  }
}
