import { FORMATIONS } from '../config/formations.js';
import { Player } from '../models/PlayerModels.js';

export default class PlayerList {
  constructor() {
    this.loadFromStorage();
    this.nextId =
      this.players.length > 0
        ? Math.max(...this.players.map((p) => p.id)) + 1
        : 1;
  }

  _commit() {
    localStorage.setItem('players', JSON.stringify(this.players));
    localStorage.setItem('formationSlots', JSON.stringify(this.formationSlots));
    localStorage.setItem('selectedFormation', this.selectedFormation);
  }

  loadFromStorage() {
    const playersData = JSON.parse(localStorage.getItem('players')) || [];
    this.players = playersData.map(
      (p) =>
        new Player(
          p.id,
          p.name,
          p.age,
          p.shirtNumber,
          p.position,
          p.goals,
          p.yellowCards,
          p.redCards,
          p.isGoldenBall
        )
    );
    this.formationSlots =
      JSON.parse(localStorage.getItem('formationSlots')) || [];
    this.selectedFormation =
      localStorage.getItem('selectedFormation') || '4-2-3-1';
  }

  addPlayer(data) {
    const newPlayer = new Player(
      this.nextId++,
      data.name,
      data.age,
      data.shirtNumber,
      data.position,
      data.goals,
      data.yellowCards,
      data.redCards,
      data.isGoldenBall
    );
    this.players.push(newPlayer);
    this._commit();
  }

  deletePlayer(id) {
    this.players = this.players.filter((p) => p.id !== id);
    this.formationSlots = this.formationSlots.filter((s) => s.playerId !== id);
    this._commit();
  }

  updatePlayer(id, data) {
    this.players = this.players.map((p) =>
      p.id === id
        ? new Player(
            id,
            data.name,
            data.age,
            data.shirtNumber,
            data.position,
            data.goals,
            data.yellowCards,
            data.redCards,
            data.isGoldenBall
          )
        : p
    );
    this._commit();
  }

  getPlayerById = (id) => this.players.find((p) => p.id === id);
  isPlayerInFormation = (id) =>
    this.formationSlots.some((s) => s.playerId === id);
  setFormation(name) {
    this.selectedFormation = name;
    this.formationSlots = [];
    this._commit();
  }
  togglePlayerInFormation(id) {
    if (this.isPlayerInFormation(id)) {
      this.removePlayerFromFormation(null, id);
    } else {
      this.addPlayerToFormation(id);
    }
    this._commit();
  }

  addPlayerToFormation(id) {
    const player = this.getPlayerById(id);
    if (!player || this.isPositionFull(player.position)) return;
    const formationDef = FORMATIONS[this.selectedFormation];
    for (const [r_idx, row] of formationDef.rows.entries()) {
      for (const [c_idx, slotDef] of row.entries()) {
        if (slotDef.p === player.position) {
          const slotId = `${slotDef.l}-${r_idx}-${c_idx}`;
          if (!this.formationSlots.some((s) => s.slotId === slotId)) {
            this.formationSlots.push({ slotId, playerId: id });
            return;
          }
        }
      }
    }
  }

  removePlayerFromFormation(slotId, playerId) {
    this.formationSlots = this.formationSlots.filter(
      (s) => s.slotId !== slotId && s.playerId !== playerId
    );
    this._commit();
  }

  isPositionFull(pos) {
    const max = FORMATIONS[this.selectedFormation].rows
      .flat()
      .filter((s) => s.p === pos).length;
    const current = this.formationSlots
      .map((s) => this.getPlayerById(s.playerId))
      .filter((p) => p && p.position === pos).length;
    return current >= max;
  }

  getFilteredPlayers(state) {
    let result = [...this.players];
    if (state.searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    if (this.players.length > 0) {
      switch (state.filter) {
        case 'top-scorer':
          const maxGoals = Math.max(...result.map((p) => p.goals));
          result = result.filter((p) => p.goals === maxGoals);
          break;
        case 'youngest':
          const minAge = Math.min(...result.map((p) => p.age));
          result = result.filter((p) => p.age === minAge);
          break;
        case 'oldest':
          const maxAge = Math.max(...result.map((p) => p.age));
          result = result.filter((p) => p.age === maxAge);
          break;
        case 'golden-ball':
          result = result.filter((p) => p.isGoldenBall);
          break;
        case 'has-yellow-card':
          result = result.filter((p) => p.yellowCards > 0);
          break;
        case 'has-red-card':
          result = result.filter((p) => p.redCards > 0);
          break;
        case 'forward':
        case 'midfielder':
        case 'defender':
        case 'goalkeeper':
          result = result.filter((p) => p.position === state.filter);
          break;
      }
    }

    // Handle sorting
    const [sortBy, dir] = state.sort.split('-');
    const positionOrder = {
      'Thủ Môn': 1,
      'Hậu Vệ': 2,
      'Tiền Vệ': 3,
      'Tiền Đạo': 4,
    };
    result.sort((a, b) => {
      if (sortBy === 'name')
        return dir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      if (sortBy === 'position')
        return dir === 'asc'
          ? positionOrder[a.position] - positionOrder[b.position]
          : positionOrder[b.position] - positionOrder[a.position];
      return dir === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
    });
    return result;
  }

  renderPlayerList(targetEl) {
    targetEl.innerHTML = this.players
      .map((p) => {
        const inFormation = this.isPlayerInFormation(p.id);
        const posFull = !inFormation && this.isPositionFull(p.position);
        return `<li data-id="${p.id}" class="${
          inFormation ? 'in-roster' : posFull ? 'disabled' : ''
        }">
                        <div class="player-info"><p>${p.name} (#${
          p.shirtNumber
        })</p><p>${p.position}</p></div>
                        <div class="player-actions"> ${
                          !posFull
                            ? `<i class="fas ${
                                inFormation
                                  ? 'fa-minus-circle'
                                  : 'fa-plus-circle'
                              } roster-toggle"></i>`
                            : ''
                        }  <i class="fas fa-trash-alt"></i> </div>
                    </li>`;
      })
      .join('');
  }

  renderFormation(targetEl) {
    targetEl.innerHTML = FORMATIONS[this.selectedFormation].rows
      .map(
        (row, r) =>
          `<div class="formation-row">${row
            .map((slotDef, c) => {
              const slotId = `${slotDef.l}-${r}-${c}`;
              const slotData = this.formationSlots.find(
                (s) => s.slotId === slotId
              );
              const p = slotData ? this.getPlayerById(slotData.playerId) : null;
              return `<div class="player-slot ${
                p ? 'filled' : 'empty'
              }" data-slot-id="${slotId}">
                            <div class="slot-icon">${
                              p ? p.shirtNumber : `<i class="fas fa-plus"></i>`
                            }</div> <div class="player-name">${
                p ? p.name : 'Trống'
              }</div> <div class="slot-position">${slotDef.l}</div>
                            ${
                              p
                                ? `<div class="remove-player"><i class="fas fa-times"></i></div>`
                                : ''
                            } </div>`;
            })
            .join('')}</div>`
      )
      .join('');
  }

  renderPlayerGrid(targetEl, players) {
    targetEl.innerHTML =
      players.length === 0
        ? '<p style="text-align: center; width: 100%;">Không có cầu thủ nào phù hợp.</p>'
        : players
            .map(
              (p) =>
                `<div class="player-card">
                    ${
                      p.isGoldenBall
                        ? '<i class="fas fa-trophy golden-ball-icon"></i>'
                        : ''
                    }
                    <div class="shirt-number">${p.shirtNumber}</div> <h3>${
                  p.name
                }</h3> <p class="position">${p.position}</p>
                    <div class="stats"><span><strong>Tuổi:</strong> ${
                      p.age
                    }</span><span><strong>Bàn:</strong> ${p.goals}</span></div>
                    <div class="card-info">
                        ${
                          p.yellowCards > 0
                            ? `<span class="yellow">${p.yellowCards}</span>`
                            : ''
                        } ${
                  p.redCards > 0 ? `<span class="red">${p.redCards}</span>` : ''
                }
                    </div>
                </div>`
            )
            .join('');
  }
}
