const { Project, Issue, Task,Image } = require('../models');
const fs = require('fs');
const path = require('path');
// ฟังก์ชันสำหรับสร้างโครงการใหม่
exports.createProject = async (req, res) => {
    try {
        const { project_name, description,status, start_date, end_date } = req.body;
        console.log(req.file);
        // ถ้ามีการอัปโหลดไฟล์รูปภาพ      
        const project = await Project.create({
            project_name,
            description,
            status,
            start_date,
            end_date,
        });
        if (req.files && req.files.length > 0) {
            const imagePromises = req.files.map(file => {
              return Image.create({ url: `/uploads/${file.filename}`, project_id: project.project_id });
            });
            await Promise.all(imagePromises);
        } else if (req.file) {
            // สำหรับการอัปโหลดไฟล์เดี่ยว
            await Image.create({ url: `/uploads/${req.file.filename}`, project_id: project.project_id });
        }

        res.status(201).json(project);
    } catch (error) {
        console.error("Error creating project:", error.stack);
        res.status(500).json({ message: 'Error creating project', error });
    }
};


// ฟังก์ชันสำหรับดึงข้อมูลโครงการทั้งหมด
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [
                {
                  model: Issue, // รวมข้อมูลรูปภาพ
                  //attributes: ['url'], // ดึงเฉพาะ URL ของรูปภาพ
                },
                {
                    model:Task
                }
                ,
                {
                    model:Image
                }
              ]
        });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
};

// ฟังก์ชันสำหรับดึงข้อมูลโครงการตาม ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error });
    }
};
exports.getTasksByProject = async (req, res) => {
    try {
      const tasks = await Task.findAll({
        where: { project_id: req.params.project_id } // ค้นหา Task โดยใช้ project_id
      });
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks by project:", error.stack);
      res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
  };
// ฟังก์ชันสำหรับอัปเดตข้อมูลโครงการ
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const { project_name, description, start_date, end_date } = req.body;

        // ถ้ามีการอัปโหลดไฟล์รูปภาพใหม่
        const image_url = req.file ? `/uploads/${req.file.filename}` : project.image_url;

        await project.update({ project_name, description, start_date, end_date, image_url });

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error });
    }
};

// ฟังก์ชันสำหรับลบโครงการ
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: [Image]  // รวมข้อมูล Image ที่เกี่ยวข้องกับ Project นี้
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // ลบไฟล์รูปภาพที่เกี่ยวข้องกับ Project
        if (project.Images && project.Images.length > 0) {
            const imageDeletePromises = project.Images.map(image => {
                const imagePath = path.join('uploads/', '..', 'uploads', image.url.split('/uploads/')[1]);
                console.log(imagePath)
                return fs.promises.unlink(imagePath);  // ลบไฟล์รูปภาพจากโฟลเดอร์
            });
            await Promise.all(imageDeletePromises);
        }

        // ลบข้อมูลรูปภาพจากฐานข้อมูล
        await Image.destroy({ where: { project_id: project.project_id } });

        // ลบ Project ออกจากฐานข้อมูล
        await project.destroy();

        res.status(204).json();
    } catch (error) {
        console.error("Error deleting project:", error.stack);
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};
//1727190696861