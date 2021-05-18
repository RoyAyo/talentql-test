const express = require('express');
const { createPost, getPost, editPost, deletePost, getPosts } = require('../../controllers/postsController');
const router = express.Router();

//controllers

//middlewares
const { auth } = require('../../middlewares/authMiddleware');

router.get('/', getPosts);

router.post('/create', auth, createPost);

router.get('/post/:id', getPost);

router.put('/post/:id', auth, editPost );

router.delete('/post/:id', auth, deletePost );

module.exports = router;