//? LAB 1: CHECK HOBBIES - KIỂM TRA SỞ THÍCH TRONG MẢNG CHO SẴN

const hobbies = [
  'đọc sách',
  'bóng đá',
  'âm nhạc',
  'chơi game',
  'đánh cầu',
  'nhảy dây',
  'đá cầu',
  'lập trình',
];
var resultMessage = '';

const checkHobby = (value) =>
  hobbies.some((hobby) => hobby.toLowerCase() === value.trim().toLowerCase());

const form = document.getElementById('hobbyForm');
const input = document.getElementById('hobbyInput');
const output = document.getElementById('output');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const userInput = input.value.trim();

  if (!userInput) {
    resultMessage = 'Vui lòng nhập một sở thích.';
    output.innerHTML = `<div class="result not">${resultMessage}</div>`;
    return;
  }

  if (checkHobby(userInput)) {
    resultMessage = `Có chung sở thích: "${userInput}"`;
    output.innerHTML = `<div class="result ok">${resultMessage}</div>`;
  } else {
    resultMessage = `Không có trong danh sách: "${userInput}"`;
    output.innerHTML = `<div class="result not">${resultMessage}</div>`;
  }
});
