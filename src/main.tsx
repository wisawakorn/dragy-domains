import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // <-- ตรวจดูและเติมบรรทัดนี้ เพื่อสั่งให้ดึงไฟล์ CSS มาใช้งานครับ!

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
