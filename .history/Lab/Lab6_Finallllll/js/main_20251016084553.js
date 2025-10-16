// js/main.js
import { Player } from './models/PlayerModels.js';
import PlayerList from './services/PlayerList.js';

window.onload = () => {
  // === KHỞI TẠO ===
  const ui = {
    // Tập hợp các element của Modal để dễ quản lý
    modal: document.getElementById('player-modal'),
    form: document.getElementById('player-form'),
    modalTitle: document.getElementById('modal-title'),
    cancelBtn: document.getElementById('cancel-btn'),
  };

  // 1. Tạo dữ liệu ban đầu
  const initialData = [
    new Player(1, 'Nguyễn Quang Hải', 27, 'Hà Nội', 19, 'Tiền Vệ', 15, true),
    new Player(2, 'Đặng Văn Lâm', 31, 'Bình Định', 23, 'Thủ Môn', 0, false),
    new Player(
      3,
      'Nguyễn Tiến Linh',
      26,
      'Hải Dương',
      22,
      'Tiền Đạo',
      25,
      false
    ),
    new Player(4, 'Quế Ngọc Hải', 31, 'Nghệ An', 3, 'Hậu Vệ', 5, false),
  ];

  // 2. Tạo đối tượng quản lý chính
  const playerManager = new PlayerList(initialData);

  // 3. Hiển thị dữ liệu lần đầu
  playerManager.refreshUI();

  // === LẮNG NGHE SỰ KIỆN ===

  // Sự kiện cho các nút Filter
  document.getElementById('filter-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      document.querySelector('.filter-btn.active').classList.remove('active');
      e.target.classList.add('active');

      const filterType = e.target.dataset.filter;
      playerManager.filterAndRenderCards(filterType, 'player-grid');
    }
  });

  // Sự kiện cho danh sách bên trái (Sửa/Xóa)
  document.getElementById('player-list').addEventListener('click', (e) => {
    const id = parseInt(e.target.closest('li')?.dataset.id);
    if (!id) return;

    if (e.target.classList.contains('fa-trash-alt')) {
      if (confirm('Bạn có chắc chắn muốn xóa cầu thủ này?')) {
        playerManager.deletePlayer(id); // Gọi phương thức của manager
      }
    }

    if (e.target.classList.contains('fa-edit')) {
      const player = playerManager.getPlayerById(id);
      showModal(player);
    }
  });

  // Sự kiện cho form Thêm/Sửa
  ui.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(ui.form['player-id'].value);
    const playerData = {
      name: ui.form.name.value,
      age: parseInt(ui.form.age.value),
      hometown: ui.form.hometown.value,
      shirtNumber: parseInt(ui.form.shirtNumber.value),
      position: ui.form.position.value,
      goals: parseInt(ui.form.goals.value),
      isGoldenBall: ui.form.isGoldenBall.checked,
    };

    if (id) {
      playerManager.updatePlayer(id, playerData);
    } else {
      playerManager.addPlayer(playerData);
    }
    hideModal();
  });

  // Các hàm và sự kiện của Modal
  const showModal = (player = null) => {
    ui.form.reset();
    if (player) {
      ui.modalTitle.textContent = 'Chỉnh sửa Cầu thủ';
      ui.form['player-id'].value = player.id;
      ui.form.name.value = player.name;
      // ... điền các trường còn lại
    } else {
      ui.modalTitle.textContent = 'Thêm Cầu Thủ Mới';
      ui.form['player-id'].value = '';
    }
    ui.modal.style.display = 'flex';
  };
  const hideModal = () => (ui.modal.style.display = 'none');

  document
    .getElementById('add-player-btn')
    .addEventListener('click', () => showModal());
  ui.cancelBtn.addEventListener('click', hideModal);
  ui.modal.addEventListener('click', (e) => {
    if (e.target === ui.modal) hideModal();
  });
};
