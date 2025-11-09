import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PasswordList from '../components/PasswordList';
import PasswordForm from '../components/PasswordForm';
import VerifyModal from '../components/VerifyModal'; 
import { useNavigate } from 'react-router-dom';

const api = axios.create();
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

function VaultPage({ setToken }) {
    const [passwords, setPasswords] = useState([]);
    const [selectedPassword, setSelectedPassword] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/bg2.jpg')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        fetchPasswords(); 
        return () => {
            document.body.style.backgroundImage = 'none';
        }
    }, []); 


    const fetchPasswords = async () => {
        try {
            const res = await api.get('/api/passwords');
            setPasswords(res.data);
        } catch (err) { console.error("Failed to fetch passwords", err); }
    };
    
    const startVerification = (action) => {
        setActionToConfirm(() => action);
        setIsModalOpen(true);
    };

    const handleVerificationSubmit = async (masterPassword) => {
        try {
            await api.post('/api/auth/verify', { master_password: masterPassword });
            setIsModalOpen(false); 
            if (actionToConfirm) {
                actionToConfirm(); 
            }
        } catch (err) {
            alert('Verification failed. Incorrect master password.');
        }
    };
    
    const handleView = (id) => {
        startVerification(() => {
            api.get(`/api/passwords/${id}`)
               .then(res => alert(`Password is: ${res.data.password}`))
               .catch(err => alert("Could not retrieve password."));
        });
    };

    const handleEdit = (password) => {
        setSelectedPassword(password);
    };

    const handleSave = async (passwordData) => {
        try {
            await api.post('/api/passwords', passwordData);
            fetchPasswords();
            setSelectedPassword(null);
        } catch (err) { console.error("Failed to save password", err); }
    };
    
    const handleDelete = (passwordId) => {
        startVerification(() => {
            if (window.confirm("Are you sure you want to delete this entry?")) {
                api.delete(`/api/passwords/${passwordId}`)
                   .then(() => fetchPasswords())
                   .catch(err => alert("Delete failed."));
            }
        });
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            <VerifyModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleVerificationSubmit} 
            />
            <div className="container">
                <div className="vault-header">
                    <h1>🔓 Your Vault</h1>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
                <div className="main-content">
                    <PasswordForm onSave={handleSave} selectedPassword={selectedPassword} />
                    <PasswordList 
                        passwords={passwords} 
                        onView={handleView}
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                    />
                </div>
            </div>
        </>
    );
}

export default VaultPage;