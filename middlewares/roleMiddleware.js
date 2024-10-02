const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
      const { role } = req.user;
  
      // ตรวจสอบบทบาทของผู้ใช้
      if (role !== requiredRole) {
        return res.status(403).json({ message: 'Access denied, insufficient permissions' });
      }
  
      next(); // ถ้าบทบาทถูกต้อง ให้ทำงานต่อไป
    };
  };
  
  module.exports = roleMiddleware;
  