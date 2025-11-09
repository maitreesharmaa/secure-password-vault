import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import VaultPage from './pages/VaultPage';
import './App.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage setToken={setToken} />} />
                <Route 
                    path="/vault" 
                    element={token ? <VaultPage setToken={setToken} /> : <Navigate to="/login" />} 
                />
                <Route path="*" element={<Navigate to={token ? "/vault" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;