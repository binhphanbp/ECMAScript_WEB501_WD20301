import { Player } from './models/PlayerModels.js';
import PlayerList from './services/PlayerList.js';

window.onload = () => {
  const initialData = [
    new Player(
      1,
      'Nguyễn Quang Hải',
      27,
      'Hà Nội',
      19,
      'Tiền Vệ',
      15,
      true,
      3,
      0
    ),
    new Player(2, 'Đoàn Văn Hậu', 25, 'Thái Bình', 5, 'Hậu Vệ', 3, false, 5, 1),
    new Player(
      3,
      'Nguyễn Tiến Linh',
      26,
      'Hải Dương',
      22,
      'Tiền Đạo',
      25,
      false,
      1,
      0
    ),
    new Player(4, 'Quế Ngọc Hải', 31, 'Nghệ An', 3, 'Hậu Vệ', 5, false, 8, 0),
    new Player(
      5,
      'Đặng Văn Lâm',
      31,
      'Bình Định',
      23,
      'Thủ Môn',
      0,
      false,
      0,
      0
    ),
    new Player(
      6,
      'Phan Văn Đức',
      28,
      'Nghệ An',
      20,
      'Tiền Vệ',
      12,
      false,
      2,
      0
    ),
  ];

  const playerManager = new PlayerList(initialData);
  const modalUI = {
    overlay: document.getElementById('player-modal'),
    form: document.getElementById('player-form'),
    title: document.getElementById('modal-title'),
  };
  const currentState = { filter: 'all', sort: 'name-asc', searchQuery: '' };

  const refreshAllUI = () => {
    playerManager.renderPlayerList('player-list');
    playerManager.refreshFilteredGrid(currentState);
  };

  const showModal = (player = null) => {
    modalUI.form.reset();
    if (player) {
      modalUI.title.textContent = 'Chỉnh sửa Cầu thủ';
      modalUI.form['player-id'].value = player.id;
      Object.keys(player).forEach((key) => {
        if (modalUI.form[key]) {
          if (typeof player[key] === 'boolean')
            modalUI.form[key].checked = player[key];
          else modalUI.form[key].value = player[key];
        }
      });
    } else {
      modalUI.title.textContent = 'Thêm Cầu Thủ Mới';
      modalUI.form['player-id'].value = '';
    }
    modalUI.overlay.style.display = 'flex';
  };
  const hideModal = () => (modalUI.overlay.style.display = 'none');

  document.getElementById('search-input').addEventListener('input', (e) => {
    currentState.searchQuery = e.target.value;
    refreshAllUI();
  });

  document.getElementById('filter-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      document.querySelector('.filter-btn.active').classList.remove('active');
      e.target.classList.add('active');
      currentState.filter = e.target.dataset.filter;
      refreshAllUI();
    }
  });

  document.getElementById('sort-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('sort-btn')) {
      document.querySelector('.sort-btn.active').classList.remove('active');
      e.target.classList.add('active');
      currentState.sort = e.target.dataset.sort;
      refreshAllUI();
    }
  });

  document.getElementById('player-list').addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = parseInt(li.dataset.id);

    if (e.target.classList.contains('roster-toggle'))
      playerManager.toggleRoster(id);
    if (e.target.classList.contains('fa-edit'))
      showModal(playerManager.getPlayerById(id));
    if (
      e.target.classList.contains('fa-trash-alt') &&
      confirm('Bạn có chắc chắn muốn xóa cầu thủ này?')
    ) {
      playerManager.deletePlayer(id);
    }
    refreshAllUI();
  });

  modalUI.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(modalUI.form['player-id'].value);
    const playerData = {
      name: modalUI.form.name.value,
      age: parseInt(modalUI.form.age.value),
      hometown: modalUI.form.hometown.value,
      shirtNumber: parseInt(modalUI.form.shirtNumber.value),
      position: modalUI.form.position.value,
      goals: parseInt(modalUI.form.goals.value),
      isGoldenBall: modalUI.form.isGoldenBall.checked,
      yellowCards: parseInt(modalUI.form.yellowCards.value),
      redCards: parseInt(modalUI.form.redCards.value),
    };
    id
      ? playerManager.updatePlayer(id, playerData)
      : playerManager.addPlayer(playerData);
    hideModal();
    refreshAllUI();
  });

  document
    .getElementById('add-player-btn')
    .addEventListener('click', () => showModal());
  document.getElementById('cancel-btn').addEventListener('click', hideModal);
  modalUI.overlay.addEventListener('click', (e) => {
    if (e.target === modalUI.overlay) hideModal();
  });

  refreshAllUI();
};
