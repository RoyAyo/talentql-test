const { TokenExpiredError } = require('jsonwebtoken');
const {Validator} = require('node-input-validator');

const {Post} = require('../models/Post');

const createPost = async(req,res) => {

    try {

        const validate = new Validator(req.body,{
            'postMessage' : 'required|string'
        });

        const matched = await validate.check();

        if(!matched){
            return res.status(400).json({
                success:false,
                message: validate.errors
            });
        }
        
        const user = req.user;

        const message = req.body.postMessage;

        const new_post = new Post({
            user : {
                id : user._id,
                name : user.name
            },
            postMessage : message
        });

        const post = await new_post.save();

        return res.json({
            success : true,
            message : 'Post created successfully',
            data : {
                post
            }
        });
        
    } catch (error) {
        
    }

};

const getPost = async(req,res) => {
    try {

        const id = req.query.id;

        const post = await Post.findById(id);

        if(!post){

        }

        return res.json({
            success : true,
            message : '',
            data : {
                post
            }
        });
        
    } catch (error) {
        
    }
};

const deletePost = async( req, res) => {

    try {
        
        const id = req.query.id;

        const post = await Post.findById(id);

        if(!post){

        }

        post.isDeleted = true;

        await post.save();

        return res.json({
            success : true,
            message : 'Post deleted successfully',
            data : {
                
            }
        });

    } catch (error) {
        
    }

}

const editPost = async (req,res) => {

    try {
        
        const id = req.query.id;

        const post = await Post.findById(id);

        if(!post){

        }

        const user = req.user;

        if(user._id !== post.user._id){

        }

        post.postMessage = postMessage;
        
        const updated_post = await post.save();

        return res.json({
            success : true,
            message : '',
            data : {
                post : updated_post
            }
        });

    } catch (error) {
        
    }

};

module.exports = {
    createPost,
    editPost,
    deletePost,
    getPost
};