import React, { useState, useEffect } from 'react';

function PasswordForm({ onSave, selectedPassword }) {
    const [form, setForm] = useState({ site: '', username: '', password: '' });

    useEffect(() => {
        if (selectedPassword) {
            setForm(selectedPassword);
        } else {
            setForm({ site: '', username: '', password: '' });
        }
    }, [selectedPassword]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
        setForm({ site: '', username: '', password: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="password-form">
            <input name="site" value={form.site} onChange={handleChange} placeholder="Website" required />
            <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
            <button type="submit">Save</button>
        </form>
    );
}

export default PasswordForm;