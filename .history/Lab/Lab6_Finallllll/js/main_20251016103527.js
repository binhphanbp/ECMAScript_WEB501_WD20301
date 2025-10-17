// js/main.js
import PlayerList from './services/PlayerList.js';

window.onload = () => {
  const playerManager = new PlayerList();

  const ui = {
    playerList: document.getElementById('player-list'),
    searchInput: document.getElementById('search-input'),
    filterContainer: document.getElementById('filter-container'),
    sortContainer: document.getElementById('sort-container'),
    gridView: document.getElementById('grid-view'),
    rosterView: document.getElementById('roster-view'),
    playerGrid: document.getElementById('player-grid'),
    formationDisplay: document.getElementById('formation-display'),
    formationSelect: document.getElementById('formation-select'),
    modal: {
      overlay: document.getElementById('player-modal'),
      form: document.getElementById('player-form'),
      title: document.getElementById('modal-title'),
    },
    addBtn: document.getElementById('add-player-btn'),
    cancelBtn: document.getElementById('cancel-btn'),
  };

  const currentState = { filter: 'all', sort: 'name-asc', searchQuery: '' };

  const refreshUI = () => {
    playerManager.renderPlayerList(ui.playerList);
    ui.formationSelect.value = playerManager.selectedFormation;

    if (currentState.filter === 'roster') {
      ui.rosterView.classList.remove('hidden');
      ui.gridView.classList.add('hidden');
      playerManager.renderFormation(ui.formationDisplay);
    } else {
      ui.rosterView.classList.add('hidden');
      ui.gridView.classList.remove('hidden');
      const playersToShow = playerManager.getFilteredPlayers(currentState);
      playerManager.renderPlayerGrid(ui.playerGrid, playersToShow);
    }
  };

  const showModal = (player = null) => {
    ui.modal.form.reset();
    if (player) {
      ui.modal.title.textContent = 'Chỉnh sửa Cầu thủ';
      ui.modal.form['player-id'].value = player.id;
      Object.keys(player).forEach((key) => {
        if (ui.modal.form[key]) {
          if (typeof player[key] === 'boolean')
            ui.modal.form[key].checked = player[key];
          else ui.modal.form[key].value = player[key];
        }
      });
    } else {
      ui.modal.title.textContent = 'Thêm Cầu Thủ Mới';
      ui.modal.form['player-id'].value = '';
    }
    ui.modal.overlay.classList.remove('hidden');
  };
  const hideModal = () => ui.modal.overlay.classList.add('hidden');

  // Event Listeners
  ui.searchInput.addEventListener('input', (e) => {
    currentState.searchQuery = e.target.value;
    refreshUI();
  });
  ui.formationSelect.addEventListener('change', (e) => {
    playerManager.setFormation(e.target.value);
    refreshUI();
  });

  ui.filterContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      ui.filterContainer.querySelector('.active').classList.remove('active');
      e.target.classList.add('active');
      const positionMap = {
        forward: 'Tiền Đạo',
        midfielder: 'Tiền Vệ',
        defender: 'Hậu Vệ',
        goalkeeper: 'Thủ Môn',
      };
      currentState.filter =
        positionMap[e.target.dataset.filter] || e.target.dataset.filter;
      refreshUI();
    }
  });

  ui.sortContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('sort-btn')) {
      ui.sortContainer.querySelector('.active').classList.remove('active');
      e.target.classList.add('active');
      currentState.sort = e.target.dataset.sort;
      refreshUI();
    }
  });

  ui.playerList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = parseInt(li.dataset.id);
    if (e.target.classList.contains('roster-toggle')) {
      if (li.classList.contains('disabled')) return;
      playerManager.togglePlayerInFormation(id);
    } else if (e.target.classList.contains('fa-edit')) {
      showModal(playerManager.getPlayerById(id));
      return;
    } else if (
      e.target.classList.contains('fa-trash-alt') &&
      confirm('Xóa cầu thủ này?')
    ) {
      playerManager.deletePlayer(id);
    }
    refreshUI();
  });

  ui.formationDisplay.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-player');
    if (removeBtn) {
      playerManager.removePlayerFromFormation(
        removeBtn.closest('.player-slot').dataset.slotId,
        null
      );
      refreshUI();
    }
  });

  ui.modal.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(ui.modal.form['player-id'].value);
    const data = {
      name: ui.modal.form.name.value,
      age: parseInt(ui.modal.form.age.value),
      shirtNumber: parseInt(ui.modal.form.shirtNumber.value),
      position: ui.modal.form.position.value,
      goals: parseInt(ui.modal.form.goals.value),
      yellowCards: parseInt(ui.modal.form.yellowCards.value),
      redCards: parseInt(ui.modal.form.redCards.value),
      isGoldenBall: ui.modal.form.isGoldenBall.checked,
    };
    id ? playerManager.updatePlayer(id, data) : playerManager.addPlayer(data);
    hideModal();
    refreshUI();
  });

  ui.addBtn.addEventListener('click', () => showModal());
  ui.cancelBtn.addEventListener('click', hideModal);
  ui.modal.overlay.addEventListener('click', (e) => {
    if (e.target === ui.modal.overlay) hideModal();
  });

  // Khởi tạo dữ liệu mẫu nếu localStorage trống
  if (playerManager.players.length === 0) {
    playerManager.addPlayer({
      name: 'Quang Hải',
      age: 27,
      shirtNumber: 19,
      position: 'Tiền Vệ',
      goals: 15,
      yellowCards: 3,
      redCards: 0,
      isGoldenBall: true,
    });
    playerManager.addPlayer({
      name: 'Văn Hậu',
      age: 25,
      shirtNumber: 5,
      position: 'Hậu Vệ',
      goals: 3,
      yellowCards: 5,
      redCards: 1,
      isGoldenBall: false,
    });
    playerManager.addPlayer({
      name: 'Tiến Linh',
      age: 26,
      shirtNumber: 22,
      position: 'Tiền Đạo',
      goals: 25,
      yellowCards: 1,
      redCards: 0,
      isGoldenBall: false,
    });
    playerManager.addPlayer({
      name: 'Văn Lâm',
      age: 31,
      shirtNumber: 23,
      position: 'Thủ Môn',
      goals: 0,
      yellowCards: 0,
      redCards: 0,
      isGoldenBall: false,
    });
    playerManager.addPlayer({
      name: 'Hoàng Đức',
      age: 26,
      shirtNumber: 14,
      position: 'Tiền Vệ',
      goals: 8,
      yellowCards: 2,
      redCards: 0,
      isGoldenBall: false,
    });
  }
  refreshUI();
};
