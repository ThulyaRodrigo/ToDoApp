const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  dueDate: { type: Date },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Low' 
  },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  status: {
    type: String,
    enum: ['active', 'completed', 'overdue'],
    default: 'active'
  }
}, { timestamps: true });

// Pre-save middleware to update status based on due date and completion
taskSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.completed) {
    this.status = 'completed';
    if (!this.completedAt) {
      this.completedAt = now;
    }
  } else if (this.dueDate && this.dueDate < now) {
    this.status = 'overdue';
  } else {
    this.status = 'active';
  }
  
  next();
});

// Method to check if task is overdue
taskSchema.methods.isOverdue = function() {
  return !this.completed && this.dueDate && this.dueDate < new Date();
};

module.exports = mongoose.model('Task', taskSchema);
