// js/main.js
import Player from './models/Player.js';

// ✅ Yêu cầu: arr lưu mảng danh sách cầu thủ
let playerList = [
  new Player('Nguyễn Văn A', 1995, 'Hà Nội', 10, 'Tiền đạo', 25, true),
  new Player('Trần Thị B', 1998, 'Đà Nẵng', 8, 'Tiền vệ', 10),
  new Player('Lê Văn C', 1993, 'TP.HCM', 4, 'Hậu vệ', 2),
  new Player('Phạm Văn D', 1999, 'Cần Thơ', 1, 'Thủ môn', 0),
  new Player('Hoàng Văn E', 1997, 'Hải Phòng', 11, 'Tiền đạo', 30),
];

// Lấy các element từ DOM
const playerListContainer = document.getElementById('player-list');
const addPlayerForm = document.getElementById('add-player-form');

/**
 * Hàm render danh sách cầu thủ ra giao diện
 * @param {Player[]} players - Mảng các cầu thủ cần hiển thị
 */
const renderPlayers = (players) => {
  playerListContainer.innerHTML = ''; // Xóa danh sách cũ

  players.forEach((player, index) => {
    // Tạo card cho mỗi cầu thủ
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';
    playerCard.innerHTML = `
            <div class="jersey-number">${player.jerseyNumber}</div>
            <h3>${player.name}</h3>
            <p>${player.position}</p>
            <div class="actions">
                <button class="btn-detail" data-index="${index}">Chi tiết</button>
                <button class="btn-edit" data-index="${index}">Sửa</button>
                <button class="btn-delete" data-index="${index}">Xóa</button>
            </div>
        `;
    playerListContainer.appendChild(playerCard);
  });
};

/**
 * Xử lý các sự kiện click trên các nút trong card cầu thủ
 */
const handlePlayerCardActions = (event) => {
  const target = event.target;
  const playerIndex = target.dataset.index;

  if (!playerIndex) return;

  const player = playerList[playerIndex];

  // ✅ Yêu cầu: Lấy chi tiết thông tin: quê quán, tuổi của cầu thủ
  if (target.classList.contains('btn-detail')) {
    alert(`
            --- Chi tiết cầu thủ ---
            Tên: ${player.name}
            Tuổi: ${player.getAge()}
            Quê quán: ${player.getHometown()}
            Vị trí: ${player.getPosition()}
            Số bàn thắng: ${player.getGoals()}
        `);
  }

  // ✅ Yêu cầu: Sửa quê quán
  if (target.classList.contains('btn-edit')) {
    const newHometown = prompt(
      `Nhập quê quán mới cho ${player.name}:`,
      player.getHometown()
    );
    if (newHometown) {
      player.setHometown(newHometown);
      alert(`Đã cập nhật quê quán cho ${player.name}.`);
      // Không cần render lại vì thông tin này chỉ hiện ở alert
    }
  }

  // ✅ Yêu cầu tự thêm (CRUD): Xóa cầu thủ
  if (target.classList.contains('btn-delete')) {
    const confirmDelete = confirm(
      `Bạn có chắc muốn xóa cầu thủ ${player.name}?`
    );
    if (confirmDelete) {
      playerList.splice(playerIndex, 1); // Xóa khỏi mảng
      renderPlayers(playerList); // Render lại danh sách
    }
  }
};

// =================================================================
// XỬ LÝ CÁC BỘ LỌC VÀ CHỨC NĂNG
// =================================================================

// ✅ Yêu cầu: Tìm cầu thủ là quả bóng vàng
document.getElementById('btn-golden-ball').addEventListener('click', () => {
  const goldenBallPlayers = playerList.filter((player) =>
    player.isGoldenBallWinner()
  );
  renderPlayers(goldenBallPlayers);
});

// ✅ Yêu cầu: Cầu thủ ở vị trí tiền đạo
document.getElementById('btn-forwards').addEventListener('click', () => {
  const forwards = playerList.filter(
    (player) => player.getPosition() === 'Tiền đạo'
  );
  renderPlayers(forwards);
});

// Hiển thị tất cả
document.getElementById('btn-all').addEventListener('click', () => {
  renderPlayers(playerList);
});

// ✅ Yêu cầu: Lấy số bàn thắng lớn nhất
document.getElementById('btn-top-scorer').addEventListener('click', () => {
  if (playerList.length === 0) {
    alert('Không có cầu thủ nào trong danh sách.');
    return;
  }
  const topScorer = playerList.reduce((prev, current) =>
    prev.getGoals() > current.getGoals() ? prev : current
  );
  alert(
    `Cầu thủ có nhiều bàn thắng nhất là ${
      topScorer.name
    } với ${topScorer.getGoals()} bàn.`
  );
  renderPlayers([topScorer]); // Chỉ hiển thị cầu thủ này
});

// ✅ Yêu cầu tự thêm: Sắp xếp danh sách cầu thủ theo tên (A-Z)
document.getElementById('btn-sort-by-name').addEventListener('click', () => {
  const sortedList = [...playerList].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  renderPlayers(sortedList);
});

// ✅ Yêu cầu tự thêm (CRUD): Thêm cầu thủ mới
addPlayerForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Ngăn form reload trang

  const newPlayer = new Player(
    document.getElementById('name').value,
    parseInt(document.getElementById('birthYear').value),
    document.getElementById('hometown').value,
    parseInt(document.getElementById('jerseyNumber').value),
    document.getElementById('position').value,
    parseInt(document.getElementById('goals').value),
    document.getElementById('isBallonDorWinner').checked
  );

  playerList.push(newPlayer);
  renderPlayers(playerList);
  addPlayerForm.reset(); // Xóa các trường trong form
});

// =================================================================
// KHỞI TẠO ỨNG DỤNG
// =================================================================

// ✅ Yêu cầu Lab 6: sự kiện onload
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM đã tải xong. Bắt đầu ứng dụng.');
  renderPlayers(playerList);

  // Gán 1 event listener cho toàn bộ container để xử lý các click bên trong nó
  playerListContainer.addEventListener('click', handlePlayerCardActions);
});
