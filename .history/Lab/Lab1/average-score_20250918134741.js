const dssv = [
  { mssv: 'SV001', ten: 'Nguyen Van A', mon1: 9.5, mon2: 9 },
  { mssv: 'SV002', ten: 'Tran Thi B', mon1: 8.2, mon2: 8.5 },
  { mssv: 'SV003', ten: 'Le Van C', mon1: 7.5, mon2: 7 },
  { mssv: 'SV004', ten: 'Pham Thi D', mon1: 5.5, mon2: 6 },
  { mssv: 'SV005', ten: 'Hoang Van E', mon1: 4, mon2: 4.5 },
  { mssv: 'SV006', ten: 'Nguyen Thi F', mon1: 9, mon2: 9.2 },
  { mssv: 'SV007', ten: 'Tran Van G', mon1: 8.7, mon2: 8.9 },
  { mssv: 'SV008', ten: 'Le Thi H', mon1: 6.8, mon2: 7 },
  { mssv: 'SV009', ten: 'Pham Van I', mon1: 5.2, mon2: 5 },
  { mssv: 'SV010', ten: 'Do Thi J', mon1: 3.8, mon2: 4.2 },
  { mssv: 'SV011', ten: 'Ngo Van K', mon1: 9.7, mon2: 9.5 },
  { mssv: 'SV012', ten: 'Nguyen Thi L', mon1: 8.3, mon2: 8 },
  { mssv: 'SV013', ten: 'Tran Van M', mon1: 7, mon2: 7.2 },
  { mssv: 'SV014', ten: 'Le Thi N', mon1: 6, mon2: 5.8 },
  { mssv: 'SV015', ten: 'Pham Van O', mon1: 4.5, mon2: 4 },
];

const tinhDiemTB = (sv) => ((sv.mon1 + sv.mon2) / 2).toFixed(1);

const xepLoai = (diemTB) => {
  const dtb = parseFloat(diemTB);
  if (dtb >= 9) return { loai: 'Xuất sắc', class: 'xuat-sac' };
  if (dtb >= 8) return { loai: 'Giỏi', class: 'gioi' };
  if (dtb >= 6.5) return { loai: 'Khá', class: 'kha' };
  if (dtb >= 5) return { loai: 'Trung bình', class: 'trungbinh' };
  return { loai: 'Yếu', class: 'yeu' };
};

const hienThiDSSV = () => {
  const tbody = document.querySelector('#bangdiem tbody');
  tbody.innerHTML = '';

  dssv.forEach((sv) => {
    const diemTB = tinhDiemTB(sv);
    const loai = xepLoai(diemTB);

    const tr = document.createElement('tr');
    tr.innerHTML = `
            <td>${sv.mssv}</td>
            <td>${sv.ten}</td>
            <td>${sv.mon1}</td>
            <td>${sv.mon2}</td>
            <td>${diemTB}</td>
            <td class="${loai.class}">${loai.loai}</td>
          `;
    tbody.appendChild(tr);
  });
};

hienThiDSSV();
