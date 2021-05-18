const express = require('express');
const { registerUser, loginUser, verifyEmail, passwordForgot, passwordReset } = require('../../controllers/authenticationController');
const router = express.Router();

//controllers

//middlewares
// const { auth } = require('../../middlewares/authMiddleware');

// router.get('/me', registerUser)

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/email/verify', verifyEmail);

router.post('/password/forgot', passwordForgot);

router.post('/password/reset', passwordReset);

module.exports = router;