const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Create Task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task({
      user: req.user.userId,
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || 'Low',
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Tasks for User with filtering and sorting
router.get('/', auth, async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      filter = 'all'
    } = req.query;

    // Build filter object
    let filterObj = { user: req.user.userId };

    // Apply status filter
    if (status && status !== 'all') {
      filterObj.status = status;
    }

    // Apply priority filter
    if (priority && priority !== 'all') {
      filterObj.priority = priority;
    }

    // Apply search filter
    if (search && search.trim() !== '') {
      filterObj.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Apply date-based filters
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    if (filter === 'today') {
      filterObj.dueDate = {
        $gte: today,
        $lt: tomorrow
      };
    } else if (filter === 'upcoming') {
      filterObj.dueDate = { $gte: now };
      filterObj.completed = false;
    } else if (filter === 'overdue') {
      filterObj.dueDate = { $lt: now };
      filterObj.completed = false;
    } else if (filter === 'completed') {
      filterObj.completed = true;
    } else if (filter === 'active') {
      filterObj.completed = false;
    }

    // Build sort object
    let sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // If sorting by priority, use custom order
    if (sortBy === 'priority') {
      const tasks = await Task.find(filterObj);
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      tasks.sort((a, b) => {
        const aVal = priorityOrder[a.priority] || 0;
        const bVal = priorityOrder[b.priority] || 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
      return res.json(tasks);
    }

    const tasks = await Task.find(filterObj).sort(sortObj);
    
    // Update overdue status for active tasks
    const updatedTasks = await Promise.all(
      tasks.map(async (task) => {
        if (!task.completed && task.dueDate && task.dueDate < now && task.status !== 'overdue') {
          task.status = 'overdue';
          await task.save();
        }
        return task;
      })
    );

    res.json(updatedTasks);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('Get task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Task
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const updateData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || 'Low',
    };

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark as Complete
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { 
        completed: true, 
        completedAt: new Date(),
        status: 'completed'
      },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('Complete task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Completion
router.patch('/:id/reset', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.completed = false;
    task.completedAt = null;
    
    // Recalculate status based on due date
    const now = new Date();
    if (task.dueDate && task.dueDate < now) {
      task.status = 'overdue';
    } else {
      task.status = 'active';
    }
    
    await task.save();
    res.json(task);
  } catch (err) {
    console.error('Reset task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();

    // Convert userId to ObjectId for aggregation
    const mongoose = require('mongoose');
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const stats = await Task.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          completedOnTime: { $sum: { $cond: [{ $and: ['$completed', { $or: [{ $eq: ['$dueDate', null] }, { $lte: ['$completedAt', '$dueDate'] }] }] }, 1, 0] } },
          completedOverdue: { $sum: { $cond: [{ $and: ['$completed', { $ne: ['$dueDate', null] }, { $gt: ['$completedAt', '$dueDate'] }] }, 1, 0] } },
          active: { $sum: { $cond: [{ $and: [{ $eq: ['$completed', false] }, { $or: [{ $eq: ['$dueDate', null] }, { $gte: ['$dueDate', now] }] }] }, 1, 0] } },
          overdue: { $sum: { $cond: [{ $and: [{ $eq: ['$completed', false] }, { $ne: ['$dueDate', null] }, { $lt: ['$dueDate', now] }] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$priority', 'Medium'] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ['$priority', 'Low'] }, 1, 0] } },
          highCompleted: { $sum: { $cond: [{ $and: [{ $eq: ['$priority', 'High'] }, '$completed'] }, 1, 0] } },
          mediumCompleted: { $sum: { $cond: [{ $and: [{ $eq: ['$priority', 'Medium'] }, '$completed'] }, 1, 0] } },
          lowCompleted: { $sum: { $cond: [{ $and: [{ $eq: ['$priority', 'Low'] }, '$completed'] }, 1, 0] } }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      completed: 0,
      completedOnTime: 0,
      completedOverdue: 0,
      active: 0,
      overdue: 0,
      high: 0,
      medium: 0,
      low: 0,
      highCompleted: 0,
      mediumCompleted: 0,
      lowCompleted: 0
    };

    // Calculate completion rate
    result.completionRate = result.total > 0 ? Math.round((result.completed / result.total) * 100) : 0;
    result.onTimeRate = result.completed > 0 ? Math.round((result.completedOnTime / result.completed) * 100) : 0;

    res.json(result);
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
