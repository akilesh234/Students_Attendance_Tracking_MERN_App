import React from 'react';

function StudentTable({ students, onEdit, onDelete }) {
    return (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Standard</th>
                    <th>Section</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student) => (
                    <tr key={student._id}>
                        <td>{student.name}</td>
                        <td>{student.rollNumber}</td>
                        <td>{student.standard}</td>
                        <td>{student.section}</td>
                        <td>
                            <button onClick={() => onEdit(student)} style={{ marginRight: '5px' }}>
                                Edit
                            </button>
                            <button onClick={() => onDelete(student._id)} style={{ color:'red' }}>
                                Deactivate
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default StudentTable;