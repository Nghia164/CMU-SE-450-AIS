// file: frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Quét tất cả các file trong thư mục src để áp dụng CSS
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tùy chỉnh thêm tông màu trắng chủ đạo (Clean & Minimalist) [3]
        primary: "#ffffff",
        secondary: "#f3f4f6"
      }
    },
  },
  plugins: [],
}
