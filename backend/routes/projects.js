const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/projects
// @desc    Create a project
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, author } = req.body;

  try {
    const newProject = new Project({
      title,
      description,
      author
    });

    const project = await newProject.save();

    // Broadcast to socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('project_created', {
        message: `New project detected: ${title}`,
        project
      });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const title = project.title;
    await project.deleteOne();

    // Broadcast to socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('project_deleted', {
        message: `Project purged: ${title}`,
        id: req.params.id
      });
    }

    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
