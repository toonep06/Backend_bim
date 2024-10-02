const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // ดึง JWT Token จาก Header
  const token = req.headers.authorization?.split(' ')[1];

  // ถ้าไม่มี token ให้ส่ง error กลับไป
  if (!token) {
    return res.status(401).json({ message: 'No token provided, access denied' });
  }

  // ตรวจสอบความถูกต้องของ token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // เก็บข้อมูลผู้ใช้ที่ยืนยันตัวตนแล้วใน request object
    next(); // ไปยังขั้นตอนถัดไป
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
