const express = require('express');
const { createPost, getPost, editPost, deletePost } = require('../../controllers/postsController');
const router = express.Router();

//controllers

//middlewares
const { auth } = require('../../middlewares/authMiddleware');

router.get('/posts');

router.post('/post/create', createPost);

router.get('/post/:id', auth, getPost);

router.put('/post/:id', auth, editPost );

router.delete('/post/:id', auth, deletePost );

module.exports = router;