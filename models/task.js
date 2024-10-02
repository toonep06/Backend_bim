const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Image = require('./image'); // นำเข้าโมเดล Image

const Task = sequelize.define('Task', {
  task_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  task_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'in-progress',
    allowNull: false,
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'tasks',
});

// เชื่อม Task กับ Image (หนึ่ง Task มีหลาย Image)
Task.hasMany(Image, { foreignKey: 'task_id', onDelete: 'CASCADE' });
Image.belongsTo(Task, { foreignKey: 'task_id' });

module.exports = Task;
