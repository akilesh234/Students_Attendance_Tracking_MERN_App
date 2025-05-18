const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    date: { type: Date, required: true }, // Store normalized date (e.g., midnight UTC)
    standard: { type: String, required: true }, // Denormalized for easier querying
    section: { type: String, required: true }, // Denormalized for easier querying
    subject: { type: String, required: false, default: null }, // Optional subject tracking
    status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Index for efficient querying by date and class
attendanceSchema.index({ date: 1, standard: 1, section: 1, subject: 1 });
// Index for querying a specific student's attendance over time
attendanceSchema.index({ studentId: 1, date: -1 }); // Sort by date descending commonly useful

// Ensure only one record per student, per date, (per subject if used)
attendanceSchema.index({ studentId: 1, date: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);