const { Sequelize } = require('sequelize');
require('dotenv').config();

// สร้างการเชื่อมต่อกับฐานข้อมูล PostgreSQL โดยใช้ Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,     // ชื่อฐานข้อมูล
  process.env.DB_USER,     // ชื่อผู้ใช้ฐานข้อมูล
  process.env.DB_PASSWORD, // รหัสผ่านผู้ใช้ฐานข้อมูล
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',   // กำหนดว่าใช้ PostgreSQL
  }
);

// ทดสอบการเชื่อมต่อ
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;
