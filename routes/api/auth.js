const express = require('express');
const router = express.Router();

//controllers
const { registerUser, loginUser, verifyEmail, passwordForgot, passwordReset } = require('../../controllers/authenticationController');

//middlewares

// router.get('/me')

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/email/verify/:token', verifyEmail);

router.post('/password/forgot', passwordForgot);

router.post('/password/reset', passwordReset);

module.exports = router;