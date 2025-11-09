const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db'); 
const auth = require('../middleware/authMiddleware');
const router = express.Router();

const JWT_SECRET = 'secret-string-for-jwt';

router.post('/register', async (req, res) => {
    const { username, master_password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(master_password, 10);
        db.query('INSERT INTO users SET ?', { username, master_password: hashedPassword }, (err) => {
            if (err) return res.status(500).send('Server error on registration.');
            res.status(201).send('User registered successfully.');
        });
    } catch (e) {
        res.status(500).send('Error hashing password.');
    }
});

router.post('/login', (req, res) => {
    const { username, master_password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('Invalid credentials.');
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(master_password, user.master_password);

        if (!isMatch) {
            return res.status(401).send('Invalid credentials.');
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

router.post('/verify', auth, (req, res) => {
    const { master_password } = req.body;
    const userId = req.user.id; 

    db.query('SELECT master_password FROM users WHERE id = ?', [userId], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('User not found.');
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(master_password, user.master_password);

        if (!isMatch) {
            return res.status(401).send('Invalid master password.');
        }
        res.json({ success: true });
    });
});


module.exports = router;