const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// สร้าง JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user.user_id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// ลงทะเบียนผู้ใช้ใหม่
exports.register = async (req, res) => {
    try {
      const { username, password, role } = req.body;
      
      // ตรวจสอบว่าข้อมูลที่จำเป็นมีครบหรือไม่
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      // สร้างผู้ใช้ใหม่
      const user = await User.create({ username, password, role });
      
      // สร้าง JWT Token
      const token = generateToken(user);
      res.status(201).json({ token });
    } catch (error) {
      // แสดงข้อผิดพลาดที่ชัดเจน
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  };
  

// เข้าสู่ระบบ
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user);
    res.status(200).json({ token ,user_id:user.user_id,username:username,role:user.role});
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
