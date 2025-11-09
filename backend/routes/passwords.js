const express = require('express');
const router = express.Router();
const controller = require('../controllers/passwordController');
const auth = require('../middleware/authMiddleware'); 

router.get('/', auth, controller.getPasswords);
router.get('/:id', auth, controller.getPasswordById);
router.post('/', auth, controller.addPassword);
router.delete('/:id', auth, controller.deletePassword);

module.exports = router;