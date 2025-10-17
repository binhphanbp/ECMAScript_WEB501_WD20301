// js/main.js
import { Player } from './models/PlayerModels.js';
import PlayerList from './services/PlayerList.js';

window.onload = () => {
  // === KHỞI TẠO DỮ LIỆU BAN ĐẦU ===
  const initialData = [
    new Player(1, 'Văn Lâm', 28, 23, 'Thủ Môn'),
    new Player(2, 'Văn Hậu', 25, 5, 'Hậu Vệ'),
    new Player(3, 'Ngọc Hải', 31, 3, 'Hậu Vệ'),
    new Player(4, 'Duy Mạnh', 28, 2, 'Hậu Vệ'),
    new Player(5, 'Tấn Tài', 27, 4, 'Hậu Vệ'),
    new Player(6, 'Hoàng Đức', 26, 14, 'Tiền Vệ'),
    new Player(7, 'Hùng Dũng', 31, 8, 'Tiền Vệ'),
    new Player(8, 'Tuấn Anh', 29, 11, 'Tiền Vệ'),
    new Player(9, 'Quang Hải', 27, 19, 'Tiền Vệ'),
    new Player(10, 'Văn Toàn', 28, 9, 'Tiền Đạo'),
    new Player(11, 'Tiến Linh', 26, 22, 'Tiền Đạo'),
    new Player(12, 'Công Phượng', 29, 10, 'Tiền Đạo'),
  ];

  const playerManager = new PlayerList(initialData);
  const modalUI = {
    overlay: document.getElementById('player-modal'),
    form: document.getElementById('player-form'),
    title: document.getElementById('modal-title'),
  };

  // Hàm tổng hợp để render lại toàn bộ giao diện
  const refreshAllUI = () => {
    playerManager.renderPlayerList('player-list');
    playerManager.renderFormation('formation-display');
  };

  // === QUẢN LÝ MODAL ===
  const showModal = (player = null) => {
    modalUI.form.reset();
    if (player) {
      modalUI.title.textContent = 'Chỉnh sửa Cầu thủ';
      modalUI.form['player-id'].value = player.id;
      modalUI.form.name.value = player.name;
      modalUI.form.age.value = player.age;
      modalUI.form.shirtNumber.value = player.shirtNumber;
      modalUI.form.position.value = player.position;
    } else {
      modalUI.title.textContent = 'Thêm Cầu Thủ Mới';
      modalUI.form['player-id'].value = '';
    }
    modalUI.overlay.style.display = 'flex';
  };
  const hideModal = () => (modalUI.overlay.style.display = 'none');

  // === LẮNG NGHE SỰ KIỆN ===
  document
    .getElementById('formation-select')
    .addEventListener('change', (e) => {
      playerManager.setFormation(e.target.value);
      refreshAllUI();
    });

  document.getElementById('player-list').addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = parseInt(li.dataset.id);

    if (e.target.classList.contains('roster-toggle')) {
      if (li.classList.contains('disabled')) return;
      if (playerManager.isPlayerInFormation(id)) {
        const slot = playerManager.formationSlots.find(
          (s) => s.playerId === id
        );
        if (slot) playerManager.removePlayerFromFormation(slot.slotId);
      } else {
        playerManager.addPlayerToFormation(id);
      }
    } else if (e.target.classList.contains('fa-edit')) {
      showModal(playerManager.getPlayerById(id));
      return; // Tránh refresh UI ngay lập tức
    } else if (e.target.classList.contains('fa-trash-alt')) {
      if (confirm('Bạn có chắc chắn muốn xóa cầu thủ này?')) {
        playerManager.deletePlayer(id);
      }
    }
    refreshAllUI();
  });

  document
    .getElementById('formation-display')
    .addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.remove-player');
      if (removeBtn) {
        const slot = removeBtn.closest('.player-slot');
        const slotId = slot.dataset.slotId;
        playerManager.removePlayerFromFormation(slotId);
        refreshAllUI();
      }
    });

  modalUI.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(modalUI.form['player-id'].value);
    const playerData = {
      name: modalUI.form.name.value,
      age: parseInt(modalUI.form.age.value),
      shirtNumber: parseInt(modalUI.form.shirtNumber.value),
      position: modalUI.form.position.value,
    };

    if (id) {
      playerManager.updatePlayer(id, playerData);
    } else {
      playerManager.addPlayer(playerData);
    }
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

  // === KHỞI CHẠY LẦN ĐẦU ===
  refreshAllUI();
};
