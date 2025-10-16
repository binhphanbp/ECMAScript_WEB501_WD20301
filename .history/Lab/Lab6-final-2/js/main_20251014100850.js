// js/main.js

import { Player } from './models.js';
import { PlayerList } from './PlayerList.js';

// Đảm bảo code chỉ chạy khi trang đã tải xong
window.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo dữ liệu cầu thủ
  const p1 = new Player('TranBaHo', 1999, 'TP.HCM', 10, 'Tiền đạo', 30);
  const p2 = new Player('ThanhXuan', 1997, 'TP.HCM', 8, 'Hậu vệ', 20);
  const p3 = new Player('TranTuan', 1994, 'TP.HCM', 27, 'Tiền vệ', 22);
  const p4 = new Player('ThanhThien', 2004, 'TP.HCM', 24, 'Tiền vệ', 15);
  const p5 = new Player('QuangHai', 1997, 'Hà Nội', 19, 'Tiền vệ', 30);

  const initialPlayers = [p1, p2, p3, p4, p5];

  // 2. Tạo đối tượng quản lý danh sách
  const playerListManager = new PlayerList(initialPlayers);

  // 3. Hiển thị danh sách ban đầu ra màn hình
  playerListManager.display();

  // 4. Gán sự kiện cho nút bấm
  document.getElementById('btnFindTopScorer').addEventListener('click', () => {
    const topScorers = playerListManager.findTopScorers();

    if (topScorers.length > 0) {
      const topScorerNames = topScorers.map((player) => player.name).join(', ');
      alert(
        `Cầu thủ ghi nhiều bàn nhất là: ${topScorerNames} với ${topScorers[0].getGoals()} bàn!`
      );
    } else {
      alert('Không có cầu thủ nào trong danh sách!');
    }
  });
});
