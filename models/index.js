const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./user'); // ตรวจสอบว่ามีการนำเข้าโมเดล User
const Issue = require('./issue'); // เพิ่มโมเดล Issue
const Task = require('./task');
const Image = require('./image');

// สร้างโมเดล Project
const Project = sequelize.define('Project', {
  project_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  project_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active',
  },
  image_url: {
    type: DataTypes.STRING, // URL ของรูปภาพโครงการ
    allowNull: true, // อนุญาตให้ว่างได้
  },
}, {
  tableName: 'projects', // กำหนดชื่อตารางในฐานข้อมูล
});

Project.hasMany(require('./task'), { foreignKey: 'project_id', onDelete: 'CASCADE' });
Project.hasMany(require('./issue'), { foreignKey: 'project_id', onDelete: 'CASCADE' });

Project.hasMany(Image, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Image.belongsTo(Project, { foreignKey: 'project_id' });

const initModels = async () => {
  try {
    await sequelize.authenticate();  // ตรวจสอบการเชื่อมต่อ
    await sequelize.sync();          // สร้างตารางในฐานข้อมูล
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};


sequelize.sync({ alter: true }) // อัปเดตตารางตามการเปลี่ยนแปลงในโมเดล
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
module.exports = {
  Project,
  initModels,
  User,
  Issue,
  Task,
  Image

};
1