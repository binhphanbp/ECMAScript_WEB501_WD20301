// js/main.js
import { Player } from './models.js';
import { PlayerList } from './PlayerList.js';

const initialPlayers = [
  new Player('Nguyễn Văn A', 1995, 'Hà Nội', 10, 'Tiền đạo', 25, true),
  new Player('Trần Thị B', 1998, 'Đà Nẵng', 8, 'Tiền vệ', 10),
  new Player('Lê Văn C', 1993, 'TP.HCM', 4, 'Hậu vệ', 2),
  new Player('Phạm Văn D', 1999, 'Cần Thơ', 1, 'Thủ môn', 0),
  new Player('Hoàng Văn E', 1997, 'Hải Phòng', 11, 'Tiền đạo', 30),
];

const playerManager = new PlayerList(initialPlayers);

const playerListContainer = document.getElementById('player-list');
const sidebarListContainer = document.getElementById('sidebar-player-list');
const addPlayerForm = document.getElementById('add-player-form');
const filterControls = document.querySelector('.controls');

const renderSidebarList = (players) => {
  sidebarListContainer.innerHTML = '';
  players.forEach((player) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
            <div class="player-info">
                <strong>${player.name}</strong>
                <p>${player.position}</p>
            </div>
        `;
    sidebarListContainer.appendChild(listItem);
  });
};

const renderPlayers = (players) => {
  playerListContainer.innerHTML = '';
  const fullList = playerManager.getPlayers();

  players.forEach((player) => {
    const originalIndex = fullList.findIndex((p) => p === player);
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';
    playerCard.innerHTML = `
            <div class="jersey-number">${player.jerseyNumber}</div>
            <h3>${player.name}</h3>
            <p>${player.position}</p>
            <div class="actions">
                <button class="btn-detail" data-index="${originalIndex}">Chi tiết</button>
                <button class="btn-edit" data-index="${originalIndex}">Sửa</button>
                <button class="btn-delete" data-index="${originalIndex}">Xóa</button>
            </div>
        `;
    playerListContainer.appendChild(playerCard);
  });
};

const updateFullUI = () => {
  const allPlayers = playerManager.getPlayers();
  renderSidebarList(allPlayers);
  renderPlayers(allPlayers);
};

const handlePlayerCardActions = (event) => {
  const target = event.target;
  const playerIndex = target.dataset.index;
  if (playerIndex === undefined) return;

  const player = playerManager.getPlayerByIndex(playerIndex);
  if (!player) return;

  if (target.classList.contains('btn-detail')) {
    alert(
      `--- Chi tiết cầu thủ ---\nTên: ${
        player.name
      }\nTuổi: ${player.getAge()}\nQuê quán: ${player.getHometown()}\nSố bàn thắng: ${player.getGoals()}`
    );
  }

  if (target.classList.contains('btn-edit')) {
    const newHometown = prompt(
      `Nhập quê quán mới cho ${player.name}:`,
      player.getHometown()
    );
    if (newHometown && newHometown.trim() !== '') {
      player.setHometown(newHometown.trim());
      alert(`Đã cập nhật quê quán cho ${player.name}.`);
    }
  }

  if (target.classList.contains('btn-delete')) {
    if (confirm(`Bạn có chắc muốn xóa cầu thủ ${player.name}?`)) {
      playerManager.removePlayer(playerIndex);
      updateFullUI();
      // Đặt lại filter về "Tất cả" để tránh lỗi hiển thị
      document.getElementById('btn-all').click();
    }
  }
};

const setActiveFilter = (activeButton) => {
  filterControls
    .querySelectorAll('button')
    .forEach((button) => button.classList.remove('active'));
  activeButton.classList.add('active');
};

filterControls.addEventListener('click', (event) => {
  const clickedButton = event.target;
  if (clickedButton.tagName !== 'BUTTON') return;
  setActiveFilter(clickedButton);

  switch (clickedButton.id) {
    case 'btn-all':
      renderPlayers(playerManager.getPlayers());
      break;
    case 'btn-forwards':
      renderPlayers(playerManager.getForwards());
      break;
    case 'btn-golden-ball':
      renderPlayers(playerManager.getGoldenBallWinners());
      break;
    case 'btn-top-scorer':
      renderPlayers(playerManager.getTopScorers());
      break;
    case 'btn-sort-by-name':
      renderPlayers(playerManager.getSortedByName());
      break;
  }
});

addPlayerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const newPlayer = new Player(
    document.getElementById('name').value,
    parseInt(document.getElementById('birthYear').value),
    document.getElementById('hometown').value,
    parseInt(document.getElementById('jerseyNumber').value),
    document.getElementById('position').value,
    parseInt(document.getElementById('goals').value),
    document.getElementById('isBallonDorWinner').checked
  );
  playerManager.addPlayer(newPlayer);
  updateFullUI();
  addPlayerForm.reset();
  document.getElementById('btn-all').click();
});

playerListContainer.addEventListener('click', handlePlayerCardActions);

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM đã tải xong. Bắt đầu ứng dụng.');
  updateFullUI();
  document.getElementById('btn-all').classList.add('active');
});
