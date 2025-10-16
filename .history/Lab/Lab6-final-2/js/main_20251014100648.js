// js/main.js

// Import các class cần thiết từ các file khác
import { Player } from './models.js';
import { PlayerList } from './PlayerList.js';

// Sự kiện này đảm bảo code chỉ chạy khi toàn bộ trang đã được tải xong
window.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo dữ liệu cầu thủ
  const p1 = new Player('TranBaHo', 1999, 'TP.HCM', 10, 'Forward', 30);
  const p2 = new Player('ThanhXuan', 1997, 'TP.HCM', 8, 'Defender', 20);
  const p3 = new Player('TranTuan', 1994, 'TP.HCM', 27, 'Midfielder', 22);
  const p4 = new Player('ThanhThien', 2004, 'TP.HCM', 24, 'Midfielder', 15);
  const p5 = new Player('QuangHai', 1997, 'Ha Noi', 19, 'Midfielder', 30); // Thêm cầu thủ để test trường hợp có 2 người bằng bàn thắng

  const initialPlayers = [p1, p2, p3, p4, p5];

  // 2. Tạo một đối tượng quản lý danh sách cầu thủ
  const playerListManager = new PlayerList(initialPlayers);

  // 3. Hiển thị danh sách ban đầu ra màn hình
  playerListManager.display();

  // 4. Gán sự kiện cho nút "Tìm Cầu thủ ghi nhiều bàn nhất"
  document.getElementById('btnFindTopScorer').addEventListener('click', () => {
    const topScorers = playerListManager.findTopScorers();

    if (topScorers.length > 0) {
      // Lấy tên của các cầu thủ và nối lại thành một chuỗi
      const topScorerNames = topScorers.map((player) => player.name).join(', ');
      alert(
        `Cầu thủ ghi nhiều bàn nhất là: ${topScorerNames} với ${topScorers[0].getGoals()} bàn!`
      );
    } else {
      alert('Không có cầu thủ nào trong danh sách!');
    }
  });
});
