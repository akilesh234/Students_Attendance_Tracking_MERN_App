const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    standard: { type: String, required: true, index: true, trim: true },
    section: { type: String, required: true, index: true, trim: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Unique compound index (Roll number must be unique within a specific standard and section)
studentSchema.index({ rollNumber: 1, standard: 1, section: 1 }, {
    unique: true,
    // Partial filter index to only enforce uniqueness for active students (optional)
    // partialFilterExpression: { isActive: true }
});

module.exports = mongoose.model('Student', studentSchema);