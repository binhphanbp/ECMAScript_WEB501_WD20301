import Player from './models/Player.js';

// ✅ Mảng lưu trữ danh sách cầu thủ (dữ liệu gốc)
let playerList = [
  new Player('Nguyễn Văn A', 1995, 'Hà Nội', 10, 'Tiền đạo', 25, true),
  new Player('Trần Thị B', 1998, 'Đà Nẵng', 8, 'Tiền vệ', 10),
  new Player('Lê Văn C', 1993, 'TP.HCM', 4, 'Hậu vệ', 2),
  new Player('Phạm Văn D', 1999, 'Cần Thơ', 1, 'Thủ môn', 0),
  new Player('Hoàng Văn E', 1997, 'Hải Phòng', 11, 'Tiền đạo', 30),
];

// Lấy các element từ DOM
const playerListContainer = document.getElementById('player-list'); // Grid thẻ ở cột phải
const sidebarListContainer = document.getElementById('sidebar-player-list'); // Danh sách ở cột trái
const addPlayerForm = document.getElementById('add-player-form');
const filterControls = document.querySelector('.controls'); // Container của các nút filter
/**
 * Render danh sách cầu thủ ra sidebar (cột trái)
 * @param {Player[]} players - Mảng cầu thủ để hiển thị
 */
const renderSidebarList = (players) => {
  sidebarListContainer.innerHTML = ''; // Xóa danh sách cũ
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

/**
 * Render các thẻ cầu thủ chi tiết ra grid (cột phải)
 * @param {Player[]} players - Mảng các cầu thủ cần hiển thị
 */
const renderPlayers = (players) => {
  playerListContainer.innerHTML = ''; // Xóa danh sách cũ

  players.forEach((player) => {
    // Tìm index của cầu thủ trong mảng gốc để đảm bảo các hành động (sửa, xóa) luôn đúng
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

/**
 * Cập nhật toàn bộ giao diện (cả 2 cột) dựa trên danh sách cầu thủ gốc.
 * Được gọi khi thêm hoặc xóa cầu thủ.
 */
const updateFullUI = () => {
  renderSidebarList(playerList);
  renderPlayers(playerList);
};

/**
 * Xử lý các sự kiện click trên các nút trong card cầu thủ (Chi tiết, Sửa, Xóa)
 * @param {Event} event - Sự kiện click
 */
const handlePlayerCardActions = (event) => {
  const target = event.target;
  const playerIndex = target.dataset.index;

  // Nếu không click vào nút có data-index thì bỏ qua
  if (!playerIndex) return;

  const player = playerList[playerIndex];

  // Lấy chi tiết thông tin
  if (target.classList.contains('btn-detail')) {
    alert(
      `--- Chi tiết cầu thủ ---
Tên: ${player.name}
Tuổi: ${player.getAge()}
Quê quán: ${player.getHometown()}
Vị trí: ${player.getPosition()}
Số bàn thắng: ${player.getGoals()}`
    );
  }

  // Sửa quê quán
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

  // CRUD: Xóa cầu thủ
  if (target.classList.contains('btn-delete')) {
    const confirmDelete = confirm(
      `Bạn có chắc muốn xóa cầu thủ ${player.name}?`
    );
    if (confirmDelete) {
      playerList.splice(playerIndex, 1); // Xóa khỏi mảng gốc
      updateFullUI(); // Render lại toàn bộ giao diện
    }
  }
};

/**
 * Quản lý trạng thái active cho các nút filter
 * @param {HTMLElement} activeButton - Nút vừa được click
 */
const setActiveFilter = (activeButton) => {
  const buttons = filterControls.querySelectorAll('button');
  buttons.forEach((button) => {
    button.classList.remove('active');
  });
  activeButton.classList.add('active');
};

// =================================================================
// GÁN SỰ KIỆN (Sử dụng Event Delegation)
// =================================================================

// Gán một listener duy nhất cho khu vực filter
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

// CRUD: Thêm cầu thủ mới từ form
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

  playerList.push(newPlayer); // Thêm vào mảng gốc
  updateFullUI(); // Cập nhật lại toàn bộ giao diện
  addPlayerForm.reset(); // Xóa các trường trong form
  document.getElementById('btn-all').click(); // Tự động click "Tất cả" để hiển thị danh sách mới
});

// Gán một listener duy nhất cho khu vực grid thẻ cầu thủ
playerListContainer.addEventListener('click', handlePlayerCardActions);

// =================================================================
// KHỞI TẠO ỨNG DỤNG
// =================================================================
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM đã tải xong. Bắt đầu ứng dụng.');
  updateFullUI(); // Render giao diện lần đầu

  // Mặc định active nút "Tất cả" khi tải trang
  document.getElementById('btn-all').classList.add('active');
});
