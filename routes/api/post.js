const express = require('express');
const router = express.Router();

//controllers

//middlewares
const { auth } = require('../../middlewares/authMiddleware');

router.get('/posts', auth)

router.post('/post/create');

router.get('/post/:id');

router.put('/post/:id', auth,);

router.delete('/post/:id', auth);

module.exports = router;