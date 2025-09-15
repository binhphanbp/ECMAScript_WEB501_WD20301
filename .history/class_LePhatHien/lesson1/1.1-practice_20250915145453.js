//================ ASYNC/AWAIT ==================//
/*
  TODO 1. Async/Await là cú pháp giúp làm việc với Promise dễ dàng hơn, thay vì dùng .then() .catch() và finally(). (Lưu ý: Async/Await không thay thế Promise).
    - Async dùng để báo với JavaScript rằng một hàm là bất đồng bộ. Một Async function sẽ luôn trả về một Promise.
    - Await chỉ có thể dùng được trong scope của Async function, giúp đợi cho đến khi Promise hoàn thành.
  TODO 2. Sử dụng Async/Await để giải quyết vấn đề bất đồng bộ trong lesson 21 thay vì sử dụng Callback hoặc cách xử lý với Promise.
  TODO 3. Ví dụ thực tế dễ hiểu và ngắn gọn trong việc sử dụng Async/Await để xử lý các APIs bất đồng bộ để lấy dữ liệu theo thứ tự mong muốn.
  TODO 4. Vấn đề Async/Await Hell là gì? Có giống với Callback Hell và Promise Hell hay không?
*/
// ------------------------------------------------------------------------------------------------------------------------------------
// 1. Async/Await - Khái niệm - Ví dụ đơn giản
const testPromise = new Promise((resolve, reject) => {
  let callAPISuccess = true; // Giả lập API gọi thành công
  setTimeout(() => {
    if (callAPISuccess) {
      resolve('Sau 2 giây: Đã gọi API thành công');
    } else {
      reject('Sau 2 giây: Gọi API thất bại');
    }
  }, 2000);
});
//! Async/Await để xử lý kết quả của Promise trên bằng try/catch/finally thay vì .then() .catch() và .finally() chứ không phải để thay thế Promise.
//! Lưu ý: try/catch/finally phải được bọc trong một Async function thì mới dùng được Await
// Khởi tạo hàm handleAsyncFunc
const handleAsyncFunc = async () => {
  try {
    const result = await testPromise;
    console.log('Result:', result); // Khi thành công
  } catch (error) {
    console.log('Error:', error); // Khi thất bại
  } finally {
    console.log('Hoàn tất xử lý Promise với Async/Await.'); // Dù thành công hay thất bại thì cũng sẽ chạy vào đây (Ví dụ thực tế: Ẩn loading dù gọi API thành công hay thất bại)
  }
};
// Thực thi hàm handleAsyncFunc
// handleAsyncFunc();

// ------------------------------------------------------------------------------------------------------------------------------------
//  2. Sử dụng Async/Await để giải quyết vấn đề bất đồng bộ trong lesson 21 thay vì sử dụng Callback hoặc cách xử lý với Promise.
// Bước 1: Khởi tạo biến để lưu trữ dữ liệu sau khi đọc file xong
let fileData = null;
console.log('B1: Bắt đầu đọc file dữ liệu, dự kiến tốn mất 3s...');

// Bước 2: Khởi tạo hàm và bắt đầu đọc file dữ liệu
console.log('B2: Giả lập đang đọc file dữ liệu, thực thi hàm readFileData...');
// Khởi tạo một hàm readFileData có nhiệm vụ đọc file, giả lập sẽ tổn 3 giây (Thực tế sẽ còn phụ thuộc vào dung lượng file)
const readFileData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Bước 3: Đọc file dữ liệu xong
      console.log('B3: Đọc file dữ liệu xong, gán vào biến fileData');
      fileData = 'Bình Phan - Fullstack Developer';

      resolve(fileData);
      // reject('Lỗi đọc file dữ liệu!'); // Giả lập lỗi đọc file dữ liệu
    }, 3000);
  });
};

// const handleGetFileData = async () => {
//   try {
//     const fileData = await readFileData();
//     console.log(
//       'B4: Kết thúc quá trình đọc file dữ liệu thành công với data nhận được là',
//       fileData
//     );
//   } catch (error) {
//     console.log('B4: Kết thúc quá trình đọc file dữ liệu với lỗi:', error);
//   } finally {
//     () => {
//       console.log(
//         'B5: Kết thúc quá trình đọc file dữ liệu với Async/Await và IIFE.'
//       );
//     };
//   }
// };
// handleGetFileData();

//! Thay vì phải tạo một Async Function handleGetFileData() như bên trên thì dùng IIFE để tạo Anonymous async function để giải quyết vấn đề bất đồng bộ.
//* Hướng dẫn nhanh về IIFE (Immediately Invoked Function Expression)
//! Lưu ý: Khi dùng IIFE thì phải nên có dấu chấm phẩy ở đầu câu và kết thúc của IIFE để tránh việc nó bị coi là tham số của một hàm khác.
// https://developer.mozilla.org/en-US/docs/Glossary/IIFE
(async () => {
  try {
    const fileData = await readFileData();
    console.log(
      'B4: Kết thúc quá trình đọc file dữ liệu thành công với data nhận được là',
      fileData
    );
  } catch (error) {
    console.log('B4: Kết thúc quá trình đọc file dữ liệu với lỗi:', error);
  } finally {
    console.log(
      'B5: Kết thúc quá trình đọc file dữ liệu với Async/Await và IIFE.'
    );
  }
})();

// ------------------------------------------------------------------------------------------------------------------------------------
// 3. Ví dụ thực tế dễ hiểu và ngắn gọn trong việc sử dụng Async/Await để xử lý các APIs bất đồng bộ để lấy dữ liệu theo thứ tự mong muốn.
const getListPokemon = async (limit = 10) => {
  try {
    const responseRawData = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
      {
        method: 'GET',
      }
    );
    const pokemon = await responseRawData.json();

    console.log('List Pokemon:', pokemon);
    console.log('Đã lấy thành công danh sách pokemon và log ra terminal.');
  } catch (error) {
    console.log(`Error fetch API:`, error);
  } finally {
    console.log('Hoàn tất quá trình gọi API lấy danh sách Pokemon.');
  }
};
// Gọi hàm getListPokemon với limit = 5
getListPokemon(10);

// ------------------------------------------------------------------------------------------------------------------------------------
//? 4. Vấn đề Async/Await Hell là gì? Có giống với Callback Hell và Promise Hell hay không?
//! Ví dụ đơn giản, có 5 cái Job, giả sử chúng có nhiệm vụ riêng biệt không hề liên quan đến nhau mà gọi như dưới đây sẽ gây ảnh hưởng nghiêm trọng về hiệu suất bởi vì chúng nó phải chờ nhau chứ không chạy cùng lúc => Async/Await Hell
try {
  await Job1_(); // Job 1 chạy
  await Job2_(); // Job 2 phải chờ Job 1 hoàn thành
  await Job3_(); // Job 3 phải chờ Job 2 và 1 hoàn thành
  await Job4_(); // Job 4 phải chờ Job 3, 2 và 1 hoàn thành
  await Job5_(); // Job 5 phải chờ Job 4, 3, 2 và 1 hoàn thành
} catch (error) {
  console.log(error);
}
//? Cách khắc phục Async/Await Hell
//* => Chỉ nên dùng await tuần nếu tác vụ sau bị phụ thuộc vào kết quả của tác vụ trước.
//* => Nếu không thì nên dùng Promise.all để chạy song song khi các tác vụ không phụ thuộc nhau.

//? MỘT SỐ KIẾN THỨC NÂNG CAO CẦN NGHIÊN CỨU THÊM
/**
 * ? - Tại sao một Async Function lại luôn trả về một Promise? Bên dưới nó hoạt động như thế nào?
 * ? - Nếu có nhiều await trong một Function thì nó sẽ chạy như thế nào? Và một cái lỗi thì nó sẽ ra sao?
 * ? - Promise all, allSettled, race...vv
 * ?...vv
 */
