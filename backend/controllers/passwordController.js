const db = require('../models/db');
const { encrypt, decrypt } = require('../utils/crypto');

exports.getPasswords = (req, res) => {
    const userId = req.user.id; 
    db.query('SELECT id, site, username FROM passwords WHERE user_id = ?', [userId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};
 
exports.getPasswordById = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    db.query('SELECT password FROM passwords WHERE id = ? AND user_id = ?', [id, userId], async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Not found or not authorized');
        try {
            const decryptedPassword = await decrypt(results[0].password);
            res.json({ password: decryptedPassword });
        } catch (e) {
            res.status(500).send('Decryption failed');
        }
    });
};

exports.addPassword = async (req, res) => {
    const userId = req.user.id;
    const { site, username, password } = req.body;
    try {
        const encryptedPassword = await encrypt(password);
        const newEntry = { site, username, password: encryptedPassword, user_id: userId };
        db.query('INSERT INTO passwords SET ?', newEntry, (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).json({ id: result.insertId, site, username });
        });
    } catch (e) {
        res.status(500).send('Encryption failed');
    }
};

exports.deletePassword = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    db.query('DELETE FROM passwords WHERE id = ? AND user_id = ?', [id, userId], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Not found or not authorized');
        res.status(200).send('Password deleted successfully.');
    });
};