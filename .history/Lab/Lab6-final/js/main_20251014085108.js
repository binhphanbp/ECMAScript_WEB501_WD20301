// js/main.js
import Player from './models/Player.js';

let playerList = [
  // ... (dữ liệu cầu thủ giữ nguyên)
];

// Lấy các element từ DOM
const playerListContainer = document.getElementById('player-list');
const sidebarListContainer = document.getElementById('sidebar-player-list'); // MỚI
const addPlayerForm = document.getElementById('add-player-form');

/**
 * MỚI: Hàm render danh sách cầu thủ ra sidebar (cột trái)
 */
const renderSidebarList = () => {
  sidebarListContainer.innerHTML = ''; // Xóa danh sách cũ
  playerList.forEach((player) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
            <div class="player-info">
                <strong>${player.name}</strong>
                <p>${player.position}</p>
            </div>
            <span><img src="https://img.icons8.com/ios-glyphs/30/1a2c5a/long-arrow-right.png" alt="arrow"/></span>
        `;
    sidebarListContainer.appendChild(listItem);
  });
};

// Hàm render các thẻ cầu thủ ở cột phải (giữ nguyên)
const renderPlayers = (players) => {
  playerListContainer.innerHTML = '';
  // ... (logic bên trong không đổi)
};

// =================================================================
// TỔ CHỨC LẠI LOGIC UPDATE GIAO DIỆN
// =================================================================

/**
 * Cập nhật toàn bộ giao diện khi có thay đổi trong danh sách gốc
 * (thêm, xóa, sửa dữ liệu gốc)
 */
const updateFullUI = () => {
  renderSidebarList(); // Cập nhật cột trái
  renderPlayers(playerList); // Cập nhật cột phải với đầy đủ danh sách
};

// ... (hàm handlePlayerCardActions giữ nguyên)

// =================================================================
// XỬ LÝ CÁC SỰ KIỆN
// =================================================================

// ... (các sự kiện lọc giữ nguyên, vì chúng chỉ thay đổi view ở cột phải)

// Cập nhật sự kiện XÓA cầu thủ
// ... bên trong hàm handlePlayerCardActions
if (target.classList.contains('btn-delete')) {
  const confirmDelete = confirm(`Bạn có chắc muốn xóa cầu thủ ${player.name}?`);
  if (confirmDelete) {
    playerList.splice(playerIndex, 1);
    updateFullUI(); // <-- DÙNG HÀM MỚI
  }
}

// Cập nhật sự kiện THÊM cầu thủ
addPlayerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  // ... (logic tạo newPlayer không đổi)

  playerList.push(newPlayer);
  updateFullUI(); // <-- DÙNG HÀM MỚI
  addPlayerForm.reset();
});

// =================================================================
// KHỞI TẠO ỨNG DỤNG
// =================================================================
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM đã tải xong. Bắt đầu ứng dụng.');
  updateFullUI(); // <-- DÙNG HÀM MỚI
  playerListContainer.addEventListener('click', handlePlayerCardActions);
});
