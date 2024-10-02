const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../config/multerConfig'); // นำเข้า Multer เพื่อจัดการการอัปโหลดไฟล์

// เส้นทางการจัดการ Issue
router.post('/', authMiddleware, roleMiddleware('admin'), upload.array('images', 5), issueController.createIssue);       // สร้าง Issue พร้อมการอัปโหลดรูปภาพ (เฉพาะ admin)
router.get('/', authMiddleware, issueController.getAllIssues);                                // ดึงข้อมูล Issue ทั้งหมด
router.get('/:id', authMiddleware, issueController.getIssueById);                            // ดึงข้อมูล Issue ตาม ID
router.put('/:id', authMiddleware, roleMiddleware('admin'), upload.array('images', 5), issueController.updateIssue);    // อัปเดต Issue พร้อมการอัปโหลดรูปภาพใหม่ (เฉพาะ admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), issueController.deleteIssue); // ลบ Issue (เฉพาะ admin)

module.exports = router;
