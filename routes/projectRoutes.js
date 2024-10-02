const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../config/multerConfig'); // นำเข้า Multer
const projects = require('../controllers/projectController');
// เส้นทางการจัดการ Task
router.post('/', authMiddleware, roleMiddleware('admin'), upload.array('images', 5), projects.createProject);      // สร้าง Task พร้อมอัปโหลดรูปภาพ
router.get('/', authMiddleware, projects.getAllProjects);                                                        // ดึงข้อมูล Task ทั้งหมด
router.get('/:id', authMiddleware, taskController.getTaskById);                                                    // ดึงข้อมูล Task ตาม ID
router.put('/:id', authMiddleware, roleMiddleware('admin'), upload.array('images', 5), taskController.updateTask);  // อัปเดต Task พร้อมอัปโหลดรูปภาพใหม่
router.delete('/:id', authMiddleware, roleMiddleware('admin'), projects.deleteProject);                         // ลบ Task (เฉพาะ admin)
router.get('/:project_id', authMiddleware, taskController.getTasksByProject); // ดึง Task ทั้งหมดที่เกี่ยวกับ Project
module.exports = router;
