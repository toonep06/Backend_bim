const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// โมเดล Image สำหรับจัดเก็บรูปภาพที่เชื่อมโยงกับ Task หรือ Issue
const Image = sequelize.define('Image', {
  image_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: true,  // รูปภาพเชื่อมกับ Task
    references: {
      model: 'tasks',
      key: 'task_id',
    }
  },
  issue_id: {
    type: DataTypes.INTEGER,
    allowNull: true,  // รูปภาพเชื่อมกับ Issue
    references: {
      model: 'issues',
      key: 'issue_id',
    }
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: true,  
    references: {
      model: 'projects',
      key: 'project_id',
    }
  }
}, {
  tableName: 'images',
});

module.exports = Image;
