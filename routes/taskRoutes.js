const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../config/multerConfig'); // นำเข้า Multer

// เส้นทางการจัดการ Task
router.post('/', authMiddleware, roleMiddleware('admin'), upload.array('images', 5), taskController.createTask);      // สร้าง Task พร้อมอัปโหลดรูปภาพ
router.get('/', authMiddleware, taskController.getAllTasks);                                                        // ดึงข้อมูล Task ทั้งหมด
router.get('/:id', authMiddleware, taskController.getTaskById);                                                    // ดึงข้อมูล Task ตาม ID
router.put('/:id', authMiddleware, roleMiddleware('admin'), upload.array('images', 5), taskController.updateTask);  // อัปเดต Task พร้อมอัปโหลดรูปภาพใหม่
router.delete('/:id', authMiddleware, roleMiddleware('admin'), taskController.deleteTask);                         // ลบ Task (เฉพาะ admin)
router.get('/project_id/:project_id', authMiddleware, taskController.getTasksByProject); // ดึง Task ทั้งหมดที่เกี่ยวกับ Project
module.exports = router;
