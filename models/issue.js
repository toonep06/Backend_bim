const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Image = require('./image'); // นำเข้าโมเดล Image

const Issue = sequelize.define('Issue', {
  issue_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  issue_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
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
    defaultValue: 'Open',
    allowNull: false,
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'Medium',
    allowNull: false,
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'project_id',
    },
  }
}, {
  tableName: 'issues',
});

// เชื่อม Issue กับ Image (หนึ่ง Issue มีหลายรูปภาพ)
Issue.hasMany(Image, { foreignKey: 'issue_id', onDelete: 'CASCADE' });
Image.belongsTo(Issue, { foreignKey: 'issue_id' });

module.exports = Issue;
