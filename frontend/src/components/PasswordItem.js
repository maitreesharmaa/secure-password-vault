import React from 'react';

function PasswordItem({ password, onView, onEdit, onDelete }) {
    return (
        <div className="password-item">
            <div className="item-info">
                <span className="item-text">{password.site} | {password.username}</span>
            </div>
            <div className="item-actions">
                <button className="btn-action btn-view" onClick={() => onView(password.id)}>View</button>
                <button className="btn-action btn-edit" onClick={() => onEdit(password)}>Edit</button>
                <button className="btn-action btn-delete" onClick={() => onDelete(password.id)}>Delete</button>
            </div>
        </div>
    );
}

export default PasswordItem;