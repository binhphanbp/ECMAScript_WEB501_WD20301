// js/main.js
import Player from './models/Player.js';

// ... (dữ liệu playerList giữ nguyên) ...

// Lấy các element từ DOM
const playerListContainer = document.getElementById('player-list');
const sidebarListContainer = document.getElementById('sidebar-player-list');
const addPlayerForm = document.getElementById('add-player-form');
const filterControls = document.querySelector('.controls'); // Lấy container của các nút filter

/**
 * THAY ĐỔI: Render danh sách cầu thủ ra sidebar (cột trái) - Đã bỏ icon
 */
const renderSidebarList = (players) => {
  sidebarListContainer.innerHTML = '';
  players.forEach((player) => {
    const listItem = document.createElement('li');
    // HTML đã được đơn giản hóa, không còn span và icon
    listItem.innerHTML = `
            <div class="player-info">
                <strong>${player.name}</strong>
                <p>${player.position}</p>
            </div>
        `;
    sidebarListContainer.appendChild(listItem);
  });
};

// ... (hàm renderPlayers ở cột phải không thay đổi) ...
const renderPlayers = (players) => {
  playerListContainer.innerHTML = '';

  players.forEach((player) => {
    const originalIndex = playerList.findIndex((p) => p === player);
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

// ... (hàm updateFullUI và handlePlayerCardActions không thay đổi) ...
const updateFullUI = () => {
  renderSidebarList(playerList);
  renderPlayers(playerList);
};
const handlePlayerCardActions = (event) => {
  /* ... code không đổi ... */
};

// =================================================================
// MỚI: HÀM QUẢN LÝ TRẠNG THÁI ACTIVE CHO CÁC NÚT FILTER
// =================================================================

const setActiveFilter = (activeButton) => {
  // Lấy tất cả các nút trong container
  const buttons = filterControls.querySelectorAll('button');
  // Xóa class 'active' khỏi tất cả các nút
  buttons.forEach((button) => {
    button.classList.remove('active');
  });
  // Thêm class 'active' cho nút vừa được click
  activeButton.classList.add('active');
};

// =================================================================
// THAY ĐỔI: GÁN LẠI SỰ KIỆN CHO CÁC NÚT LỌC
// =================================================================

filterControls.addEventListener('click', (event) => {
  const clickedButton = event.target;

  // Chỉ xử lý khi click vào một nút button
  if (clickedButton.tagName !== 'BUTTON') return;

  // Đặt trạng thái active cho nút được click
  setActiveFilter(clickedButton);

  // Xử lý logic lọc tương ứng với ID của nút
  switch (clickedButton.id) {
    case 'btn-all':
      renderPlayers(playerList);
      break;
    case 'btn-forwards':
      const forwards = playerList.filter(
        (player) => player.getPosition() === 'Tiền đạo'
      );
      renderPlayers(forwards);
      break;
    case 'btn-golden-ball':
      const goldenBallPlayers = playerList.filter((player) =>
        player.isGoldenBallWinner()
      );
      renderPlayers(goldenBallPlayers);
      break;
    case 'btn-top-scorer':
      if (playerList.length === 0) return;
      const maxGoals = Math.max(...playerList.map((p) => p.getGoals()));
      const topScorers = playerList.filter((p) => p.getGoals() === maxGoals);
      renderPlayers(topScorers);
      break;
    case 'btn-sort-by-name':
      const sortedList = [...playerList].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      renderPlayers(sortedList);
      break;
  }
});

// ... (sự kiện của form thêm cầu thủ không thay đổi) ...
addPlayerForm.addEventListener('submit', (event) => {
  /* ... code không đổi ... */
});

// =================================================================
// KHỞI TẠO ỨNG DỤNG
// =================================================================
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM đã tải xong. Bắt đầu ứng dụng.');
  updateFullUI(); // Render giao diện lần đầu

  // MỚI: Mặc định active nút "Tất cả" khi tải trang
  document.getElementById('btn-all').classList.add('active');

  playerListContainer.addEventListener('click', handlePlayerCardActions);
});
