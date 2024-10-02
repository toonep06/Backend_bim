const { Issue, Image } = require('../models'); // นำเข้าโมเดล Image เพื่อจัดการรูปภาพ

// สร้าง Issue ใหม่
exports.createIssue = async (req, res) => {
  try {
    const { issue_title, description, status, priority, project_id,start_date, end_date } = req.body;
    
    // สร้าง Issue ใหม่
    const issue = await Issue.create({
      issue_title,
      description,
      status,
      priority,
      project_id,
      start_date,
      end_date
    });
    
    // ถ้ามีการอัปโหลดไฟล์รูปภาพ
    if (req.files) {
      const imagePromises = req.files.map(file => {
        return Image.create({ url: `/uploads/${file.filename}`, issue_id: issue.issue_id });
      });
      await Promise.all(imagePromises);
    }

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Error creating issue', error });
  }
};

// ดึงข้อมูล Issue ทั้งหมด รวมถึงรูปภาพที่เกี่ยวข้อง
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.findAll({
      include: [
        {
          model: Image, // รวมข้อมูลรูปภาพ
          attributes: ['url'], // ดึงเฉพาะ URL ของรูปภาพ
        }
      ]
    });
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching issues', error });
  }
};

// ดึงข้อมูล Issue ตาม ID รวมถึงรูปภาพที่เกี่ยวข้อง
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id, {
      include: [
        {
          model: Image, // รวมข้อมูลรูปภาพ
          attributes: ['url'], // ดึงเฉพาะ URL ของรูปภาพ
        }
      ]
    });
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching issue', error });
  }
};

// อัปเดต Issue พร้อมอัปเดตไฟล์รูปภาพใหม่ (ถ้ามี)
exports.updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    const { issue_title, description, status, priority } = req.body;
    
    // อัปเดตข้อมูล Issue
    await issue.update({ issue_title, description, status, priority });
    
    // ถ้ามีการอัปโหลดไฟล์รูปภาพใหม่
    if (req.files) {
      // ลบรูปภาพเก่า
      await Image.destroy({ where: { issue_id: issue.issue_id } });
      
      // เพิ่มรูปภาพใหม่
      const imagePromises = req.files.map(file => {
        return Image.create({ url: `/uploads/${file.filename}`, issue_id: issue.issue_id });
      });
      await Promise.all(imagePromises);
    }

    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Error updating issue', error });
  }
};

// ลบ Issue พร้อมลบรูปภาพที่เกี่ยวข้อง
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // ลบรูปภาพที่เกี่ยวข้องก่อนลบ Issue
    await Image.destroy({ where: { issue_id: issue.issue_id } });

    // ลบ Issue
    await issue.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting issue', error });
  }
};
