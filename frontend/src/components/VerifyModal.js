import React, { useState } from 'react';
import './VerifyModal.css'; 

function VerifyModal({ isOpen, onClose, onSubmit }) {
    const [password, setPassword] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(password);
        setPassword(''); 
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Verify Master Password</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Re-enter Master Password"
                        autoFocus
                        required
                    />
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VerifyModal;