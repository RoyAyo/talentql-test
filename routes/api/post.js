const express = require('express');
const { createPost, getPost, editPost, deletePost } = require('../../controllers/postsController');
const router = express.Router();

//controllers

//middlewares
const { auth } = require('../../middlewares/authMiddleware');

router.get('/posts');

router.post('/create', createPost);

router.get('/:id', auth, getPost);

router.put('/:id', auth, editPost );

router.delete('/:id', auth, deletePost );

module.exports = router;