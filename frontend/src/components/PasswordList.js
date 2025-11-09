import React from 'react';
import PasswordItem from './PasswordItem';

function PasswordList({ passwords, onView, onEdit, onDelete }) {
    return (
        <div className="password-list">
            <h2>Stored Passwords ({passwords.length})</h2>
            {passwords.map(p => (
                <PasswordItem 
                    key={p.id} 
                    password={p} 
                    onView={onView} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                />
            ))}
        </div>
    );
}

export default PasswordList;