import React, { useState, useEffect, useCallback } from 'react';
import studentService from '../services/studentService';
import StudentTable from '../components/StudentTable'; // Assuming you create this
import StudentForm from '../components/StudentForm';   // Assuming you create this

function StudentManagementPage() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingStudent, setEditingStudent] = useState(null); // Student object for editing, or null for adding
     const [showForm, setShowForm] = useState(false); // Toggle visibility of the form

    // Fetch students
    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await studentService.getStudents(); // Add filters if needed {standard:'10', section:'A'}
            setStudents(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch students');
        } finally {
            setIsLoading(false);
        }
    }, []); // No dependencies if fetching all initially

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Handle Save (Add or Update)
    const handleSaveStudent = async (studentData) => {
        setIsLoading(true);
        setError('');
        try {
            if (editingStudent) {
                // Update
                await studentService.updateStudent(editingStudent._id, studentData);
            } else {
                // Add
                await studentService.addStudent(studentData);
            }
            setEditingStudent(null); // Reset editing state
             setShowForm(false); // Hide form after save
            fetchStudents(); // Refresh the list
        } catch (err) {
            setError(err.message || `Failed to ${editingStudent ? 'update' : 'add'} student`);
             // Keep form open on error? Maybe not, let user retry.
             // setShowForm(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Edit button click
    const handleEdit = (student) => {
        setEditingStudent(student);
         setShowForm(true); // Show form when editing
    };

     // Handle Add New button click
    const handleAddNew = () => {
         setEditingStudent(null); // Ensure form is in 'add' mode
        setShowForm(true); // Show form
    };

    // Handle Delete (Deactivate) button click
    const handleDelete = async (studentId) => {
         if (window.confirm('Are you sure you want to deactivate this student?')) {
             setIsLoading(true);
             setError('');
             try {
                 await studentService.deactivateStudent(studentId);
                 fetchStudents(); // Refresh the list
             } catch (err) {
                 setError(err.message || 'Failed to deactivate student');
             } finally {
                 setIsLoading(false);
             }
         }
    };

     // Handle closing the form
    const handleCloseForm = () => {
         setShowForm(false);
        setEditingStudent(null); // Clear editing state when closing
     };

    return (
        <div>
            <h2>Manage Students</h2>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

             <button onClick={handleAddNew} disabled={showForm} style={{ marginBottom: '1rem' }}>
                Add New Student
            </button>

            {/* Conditionally render the form */}
            {showForm && (
                <StudentForm
                    initialData={editingStudent} // Pass student data for editing, or null for adding
                    onSave={handleSaveStudent}
                     onCancel={handleCloseForm} // Add a cancel button to the form
                    isLoading={isLoading}
                />
            )}


             {isLoading && !showForm && <p>Loading students...</p>} {/* Show loading only when fetching list */}

             {!isLoading && !showForm && students.length > 0 && (
                <StudentTable
                    students={students}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {!isLoading && !showForm && students.length === 0 && (
                <p>No students found.</p>
            )}
        </div>
    );
}

export default StudentManagementPage;