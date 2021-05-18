const express = require('express');
const router = express.Router();

//controllers

//middlewares
const { auth } = require('../../middlewares/authMiddleware');

router.get('/me', auth)

router.post('/register');

router.post('/token');

router.post('/email/verify');

router.post('/password/forgot');

router.post('/password/reset');

module.exports = router;