const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { initModels } = require('./models'); // นำเข้าโมเดลทั้งหมด
const projectRoutes = require('./routes/projectRoutes'); // เส้นทางของ Project
const taskRoutes = require('./routes/taskRoutes'); // เส้นทางของ Task
const issueRoutes = require('./routes/issueRoutes'); // เส้นทางของ Issue
const authRoutes = require('./routes/authRoutes'); // เส้นทางของ Authentication
const authMiddleware = require('./middlewares/authMiddleware'); // Middleware สำหรับการยืนยันตัวตน
const cors = require('cors');
dotenv.config(); // โหลดค่า .env

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors()); // เปิดใช้ CORS
app.use(express.json()); // ให้ Express รองรับ JSON

// เส้นทางการยืนยันตัวตน (Authentication routes)
app.use('/api/auth', authRoutes);

// เส้นทางการจัดการโครงการ (Project routes)
app.use('/api/projects', authMiddleware, projectRoutes);

// เส้นทางการจัดการ Task (Task routes)
app.use('/api/tasks', authMiddleware, taskRoutes);

// เส้นทางการจัดการ Issue (Issue routes)
app.use('/api/issues', authMiddleware, issueRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// เริ่มเซิร์ฟเวอร์และเชื่อมต่อฐานข้อมูล
initModels().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Error connecting to the database:', error);
});
