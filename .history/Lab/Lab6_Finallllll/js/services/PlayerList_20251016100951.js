// js/services/PlayerList.js
import { FORMATIONS } from '../config/formations.js';

export default class PlayerList {
  constructor(initialPlayers = []) {
    this.players = initialPlayers;
    this.formationSlots = []; // Cấu trúc: [{ slotId: 'GK-0-0', playerId: 1 }]
    this.selectedFormation = '4-2-3-1'; // Sơ đồ mặc định
    this.nextId =
      this.players.length > 0
        ? Math.max(...this.players.map((p) => p.id)) + 1
        : 1;
  }

  addPlayer(playerData) {
    const newPlayer = new Player(
      this.nextId++,
      playerData.name,
      playerData.age,
      playerData.shirtNumber,
      playerData.position
    );
    this.players.push(newPlayer);
  }

  deletePlayer(id) {
    this.players = this.players.filter((player) => player.id !== id);
    const slot = this.formationSlots.find((s) => s.playerId === id);
    if (slot) {
      this.removePlayerFromFormation(slot.slotId);
    }
  }

  updatePlayer(id, updatedData) {
    this.players = this.players.map((player) => {
      if (player.id === id) {
        return new Player(
          id,
          updatedData.name,
          updatedData.age,
          updatedData.shirtNumber,
          updatedData.position
        );
      }
      return player;
    });
  }

  getPlayerById(id) {
    return this.players.find((player) => player.id === id);
  }

  setFormation(formationName) {
    this.selectedFormation = formationName;
    this.formationSlots = []; // Reset đội hình khi đổi sơ đồ
  }

  addPlayerToFormation(playerId) {
    const player = this.getPlayerById(playerId);
    if (!player || this.isPlayerInFormation(playerId)) return;

    const formationDef = FORMATIONS[this.selectedFormation];
    let slotAdded = false;

    for (let r = 0; r < formationDef.rows.length; r++) {
      for (let c = 0; c < formationDef.rows[r].length; c++) {
        const slotDef = formationDef.rows[r][c];
        if (slotDef.position === player.position) {
          const slotId = `${slotDef.label}-${r}-${c}`;
          if (!this.formationSlots.some((s) => s.slotId === slotId)) {
            this.formationSlots.push({ slotId, playerId });
            slotAdded = true;
            break;
          }
        }
      }
      if (slotAdded) break;
    }
  }

  removePlayerFromFormation(slotId) {
    this.formationSlots = this.formationSlots.filter(
      (s) => s.slotId !== slotId
    );
  }

  isPlayerInFormation(playerId) {
    return this.formationSlots.some((s) => s.playerId === playerId);
  }

  isPositionFull(position) {
    const formationDef = FORMATIONS[this.selectedFormation];
    const maxSlots = formationDef.rows
      .flat()
      .filter((s) => s.position === position).length;
    const currentSlots = this.formationSlots
      .map((s) => this.getPlayerById(s.playerId))
      .filter((p) => p && p.position === position).length;
    return currentSlots >= maxSlots;
  }

  renderPlayerList(targetElementId) {
    const playerListEl = document.getElementById(targetElementId);
    playerListEl.innerHTML = '';
    this.players.forEach((player) => {
      const inFormation = this.isPlayerInFormation(player.id);
      const positionFull = !inFormation && this.isPositionFull(player.position);
      const liClass = inFormation
        ? 'in-roster'
        : positionFull
        ? 'disabled'
        : '';
      const iconClass = inFormation ? 'fa-minus-circle' : 'fa-plus-circle';

      playerListEl.innerHTML += `
                <li data-id="${player.id}" class="${liClass}">
                    <div class="player-info"><p>${player.name} (#${
        player.shirtNumber
      })</p><p>${player.position}</p></div>
                    <div class="player-actions">
                        ${
                          !positionFull
                            ? `<i class="fas ${iconClass} roster-toggle" title="${
                                inFormation
                                  ? 'Xóa khỏi đội hình'
                                  : 'Thêm vào đội hình'
                              }"></i>`
                            : ''
                        }
                        <i class="fas fa-edit" title="Chỉnh sửa"></i> <i class="fas fa-trash-alt" title="Xóa"></i>
                    </div>
                </li>`;
    });
  }

  renderFormation(targetElementId) {
    const pitchEl = document.getElementById(targetElementId);
    pitchEl.innerHTML = '';
    const formationDef = FORMATIONS[this.selectedFormation];

    formationDef.rows.forEach((row, r_idx) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'formation-row';
      row.forEach((slotDef, c_idx) => {
        const slotId = `${slotDef.label}-${r_idx}-${c_idx}`;
        const slotData = this.formationSlots.find((s) => s.slotId === slotId);
        const player = slotData ? this.getPlayerById(slotData.playerId) : null;

        rowEl.innerHTML += `
                    <div class="player-slot ${
                      player ? 'filled' : 'empty'
                    }" data-slot-id="${slotId}">
                        <div class="slot-icon">${
                          player
                            ? player.shirtNumber
                            : `<i class="fas fa-plus"></i>`
                        }</div>
                        <div class="player-name">${
                          player ? player.name : 'Trống'
                        }</div>
                        <div class="slot-position">${slotDef.label}</div>
                        ${
                          player
                            ? `<div class="remove-player" title="Xóa khỏi vị trí"><i class="fas fa-times"></i></div>`
                            : ''
                        }
                    </div>`;
      });
      pitchEl.appendChild(rowEl);
    });
  }
}
