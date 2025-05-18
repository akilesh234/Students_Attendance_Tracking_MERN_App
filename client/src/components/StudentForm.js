import React, { useState, useEffect } from 'react';

function StudentForm({ initialData, onSave, onCancel, isLoading }) {
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        standard: '',
        section: '',
        // isActive: true // Usually not set directly in add/edit form, handled by delete/deactivate
    });
     const [formError, setFormError] = useState('');


    // Populate form if initialData (for editing) is provided
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                rollNumber: initialData.rollNumber || '',
                standard: initialData.standard || '',
                section: initialData.section || '',
            });
        } else {
            // Reset form for adding new
            setFormData({ name: '', rollNumber: '', standard: '', section: '' });
        }
         setFormError(''); // Clear errors when data changes
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
         setFormError('');
         // Basic Validation
         if (!formData.name || !formData.rollNumber || !formData.standard || !formData.section) {
            setFormError('All fields (Name, Roll Number, Standard, Section) are required.');
            return;
         }
        onSave(formData); // Pass data to parent component's handler
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h3>{initialData ? 'Edit Student' : 'Add New Student'}</h3>
            {formError && <p style={{ color: 'red' }}>{formError}</p>}
            <div>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
                <label htmlFor="rollNumber">Roll Number:</label>
                <input type="text" id="rollNumber" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
                <label htmlFor="standard">Standard:</label> {/* E.g., 10th, 12th */}
                <input type="text" id="standard" name="standard" value={formData.standard} onChange={handleChange} required />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
                <label htmlFor="section">Section:</label> {/* E.g., A, B */}
                <input type="text" id="section" name="section" value={formData.section} onChange={handleChange} required />
            </div>
            <div style={{ marginTop: '1rem' }}>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : (initialData ? 'Update Student' : 'Add Student')}
                </button>
                <button type="button" onClick={onCancel} disabled={isLoading} style={{ marginLeft: '0.5rem' }}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default StudentForm;