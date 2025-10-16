export default class PlayerList {
  constructor(initialPlayers = []) {
    this.players = initialPlayers;
    this.matchRoster = [];
    this.nextId =
      this.players.length > 0
        ? Math.max(...this.players.map((p) => p.id)) + 1
        : 1;
  }

  addPlayer(playerData) {
    const newPlayer = { id: this.nextId++, ...playerData };
    this.players.push(newPlayer);
  }

  deletePlayer(id) {
    this.players = this.players.filter((player) => player.id !== id);
    this.removeFromRoster(id);
  }

  updatePlayer(id, updatedData) {
    this.players = this.players.map((player) =>
      player.id === id ? { ...player, ...updatedData } : player
    );
  }

  getPlayerById(id) {
    return this.players.find((player) => player.id === id);
  }

  toggleRoster(playerId) {
    const isInRoster = this.matchRoster.includes(playerId);
    if (isInRoster) {
      this.removeFromRoster(playerId);
    } else {
      if (this.matchRoster.length >= 11) {
        alert('Đội hình thi đấu đã đủ 11 cầu thủ!');
        return;
      }
      this.matchRoster.push(playerId);
    }
  }

  removeFromRoster(playerId) {
    this.matchRoster = this.matchRoster.filter((id) => id !== playerId);
  }

  renderPlayerList(targetElementId) {
    const playerListEl = document.getElementById(targetElementId);
    playerListEl.innerHTML = '';

    const rosteredPlayers = [],
      availablePlayers = [];
    this.players.forEach((p) => {
      this.matchRoster.includes(p.id)
        ? rosteredPlayers.push(p)
        : availablePlayers.push(p);
    });

    const sortedPlayers = [...availablePlayers, ...rosteredPlayers];

    sortedPlayers.forEach((player) => {
      const inRoster = this.matchRoster.includes(player.id);
      playerListEl.innerHTML += `
                <li data-id="${player.id}" class="${
        inRoster ? 'in-roster' : ''
      }">
                    <div class="player-info"><p>${player.name}</p><p>${
        player.position
      }</p></div>
                    <div class="player-actions">
                        <i class="fas ${
                          inRoster ? 'fa-minus-circle' : 'fa-plus-circle'
                        } roster-toggle" title="${
        inRoster ? 'Xóa khỏi đội hình' : 'Thêm vào đội hình'
      }"></i>
                        <i class="fas fa-edit" title="Chỉnh sửa"></i>
                        <i class="fas fa-trash-alt" title="Xóa"></i>
                    </div>
                </li>`;
    });
  }

  renderPlayerCards(playersToShow, targetElementId) {
    const playerGridEl = document.getElementById(targetElementId);
    playerGridEl.innerHTML =
      playersToShow.length === 0
        ? '<p>Không tìm thấy cầu thủ nào.</p>'
        : playersToShow
            .map(
              (player) => `
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
                    <div class="card-info">
                        ${
                          player.yellowCards > 0
                            ? `<span class="yellow">${player.yellowCards}</span>`
                            : ''
                        }
                        ${
                          player.redCards > 0
                            ? `<span class="red">${player.redCards}</span>`
                            : ''
                        }
                    </div>
                </div>`
            )
            .join('');
  }

  refreshFilteredGrid(state) {
    let filteredPlayers = [...this.players];

    switch (state.filter) {
      case 'roster':
        filteredPlayers = this.players.filter((p) =>
          this.matchRoster.includes(p.id)
        );
        break;
      case 'forward':
        filteredPlayers = this.players.filter((p) => p.position === 'Tiền Đạo');
        break;
      case 'midfielder':
        filteredPlayers = this.players.filter((p) => p.position === 'Tiền Vệ');
        break;
      case 'defender':
        filteredPlayers = this.players.filter((p) => p.position === 'Hậu Vệ');
        break;
      case 'goalkeeper':
        filteredPlayers = this.players.filter((p) => p.position === 'Thủ Môn');
        break;
      case 'golden-ball':
        filteredPlayers = this.players.filter((p) => p.isGoldenBall);
        break;
      case 'has-yellow-card':
        filteredPlayers = this.players.filter((p) => p.yellowCards > 0);
        break;
      case 'has-red-card':
        filteredPlayers = this.players.filter((p) => p.redCards > 0);
        break;
    }

    if (state.searchQuery) {
      filteredPlayers = filteredPlayers.filter((p) =>
        p.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    const [sortBy, direction] = state.sort.split('-');
    filteredPlayers.sort((a, b) => {
      if (sortBy === 'name')
        return direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      return direction === 'asc'
        ? a[sortBy] - b[sortBy]
        : b[sortBy] - a[sortBy];
    });

    this.renderPlayerCards(filteredPlayers, 'player-grid');
  }
}
