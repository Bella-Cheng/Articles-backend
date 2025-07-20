const express = require('express');
const router = express.Router();
const { userLogin, userRegister } = require('../controllers/userController');

router.put('/register', userRegister);
router.post('/login', userLogin);

module.exports = router;
