# ILLUMA Learning Platform

Nền tảng học tập thông minh ILLUMA.

## Tính năng chính

- Học tập tương tác với AI Tutor
- Kết nối với giảng viên thật
- Chế độ luyện tập tương tác
- Công cụ thử nghiệm điện tử

## Cài đặt và chạy

### Yêu cầu

- Node.js 16+
- npm hoặc yarn

### Các bước cài đặt

1. Clone repository
   ```bash
   git clone https://github.com/your-username/illuma-learning.git
   cd illuma-learning
   ```

2. Cài đặt các phụ thuộc
   ```bash
   npm install
   # hoặc
   yarn
   ```

3. Cấu hình biến môi trường
   ```bash
   cp .env.example .env
   ```
   
   Chỉnh sửa file `.env` và cập nhật:
   - `VITE_OPENROUTER_API_KEY`: Đăng ký tài khoản tại [OpenRouter](https://openrouter.ai) và lấy API key

4. Chạy ứng dụng trong môi trường phát triển
   ```bash
   npm run dev
   # hoặc
   yarn dev
   ```

5. Truy cập ứng dụng tại `http://localhost:3000`

## Cấu hình OpenRouter API

Để sử dụng tính năng AI Tutor, bạn cần:

1. Đăng ký tài khoản tại [OpenRouter](https://openrouter.ai)
2. Tạo API key mới
3. Cập nhật API key vào file `.env` 
4. Khởi động lại ứng dụng

## Tài khoản demo

- Sinh viên: student@example.com / password
- Giảng viên: tutor@example.com / password

## Giấy phép

MIT
