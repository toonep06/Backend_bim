const { Task, Image, Project } = require('../models');
const { Op } = require('sequelize'); // นำเข้า Sequelize Operator เพื่อใช้สำหรับการค้นหา
// สร้าง Task ใหม่
exports.createTask = async (req, res) => {
    try {
      const { task_name, description, start_date, end_date, status ,project_id } = req.body;
      
      // สร้าง Task ใหม่
      const task = await Task.create({ task_name, description, start_date, end_date, status ,project_id });
      
      // ถ้ามีการอัปโหลดไฟล์รูปภาพ
      if (req.files) {
        const imagePromises = req.files.map(file => {
          return Image.create({ url: `/uploads/${file.filename}`, task_id: task.task_id });
        });
        await Promise.all(imagePromises);
      }
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error.stack);
      res.status(500).json({ message: 'Error creating task', error: error.message });
    }
  };
  
  
  

// ดึงข้อมูล Task ทั้งหมด รวมถึงรูปภาพที่เกี่ยวข้อง
exports.getAllTasks = async (req, res) => {
    try {
      // รับค่าพารามิเตอร์การค้นหาจาก query
      const { task_name, status, start_date, end_date } = req.query;
      
      // สร้างเงื่อนไขการค้นหา (WHERE) โดยใช้พารามิเตอร์ที่ส่งมา
      let whereConditions = {};
  
      if (task_name) {
        // ค้นหาชื่อ Task โดยใช้ LIKE
        whereConditions.task_name = { [Op.like]: `%${task_name}%` };
      }
  
      if (status) {
        // กรองตามสถานะ Task
        whereConditions.status = status;
      }
  
      if (start_date && end_date) {
        // กรอง Task ตามช่วงวันที่เริ่มต้นและสิ้นสุด
        whereConditions.start_date = { [Op.gte]: start_date };
        whereConditions.end_date = { [Op.lte]: end_date };
      }
  
      // ดึงข้อมูล Task โดยใช้เงื่อนไขที่กำหนด
      const tasks = await Task.findAll({
        where: whereConditions, // ใช้เงื่อนไขการค้นหา
        include: [
          {
            model: Image, // รวมข้อมูลรูปภาพ
            attributes: ['url'], // ดึงเฉพาะ URL ของรูปภาพ
          }
        ]
      });
  
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error.stack);
      res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
  };
  
  exports.getTaskById = async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id, {
        include: [
          {
            model: Image, // รวมข้อมูลรูปภาพ
            attributes: ['url'], // ดึงเฉพาะ URL ของรูปภาพ
          }
        ]
      });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task', error });
    }
  };
  exports.getTasksByProject = async (req, res) => {
    try {
      const tasks = await Task.findAll({
        where: { project_id: req.params.project_id },
        include: [
          {
            model: Image, // รวมข้อมูลรูปภาพ
            attributes: ['url'], // ดึงเฉพาะ URL ของรูปภาพ
          },
        ]
      });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error });
    }
  };
   

// อัปเดต Task พร้อมอัปเดตไฟล์รูปภาพใหม่ (ถ้ามี)
exports.updateTask = async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      const { task_name, description, start_date, end_date } = req.body;
      
      // อัปเดตข้อมูล Task
      await task.update({ task_name, description, start_date, end_date });
      
      // ถ้ามีการอัปโหลดไฟล์รูปภาพใหม่
      if (req.files) {
        // ลบรูปภาพเก่า
        await Image.destroy({ where: { task_id: task.task_id } });
        
        // เพิ่มรูปภาพใหม่
        const imagePromises = req.files.map(file => {
          return Image.create({ url: `/uploads/${file.filename}`, task_id: task.task_id });
        });
        await Promise.all(imagePromises);
      }
  
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error updating task', error });
    }
  };
  

// ลบ Task พร้อมลบรูปภาพที่เกี่ยวข้อง
exports.deleteTask = async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // ลบรูปภาพที่เกี่ยวข้องก่อนลบ Task
      await Image.destroy({ where: { task_id: task.task_id } });
  
      // ลบ Task
      await task.destroy();
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task', error });
    }
  };
  