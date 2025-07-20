const express = require('express');
const router = express.Router();
const { authGoogleLogin } = require('../controllers/authGoogleController');

router.post('/google', authGoogleLogin);

module.exports = router;
