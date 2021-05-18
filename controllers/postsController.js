const path = require('path');
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

        // pick all pictures
        const images = req.files?.image;
        var imagePaths = [];

        if(images){
            imagesArray = Array.isArray(images) ? images : [images]; 

            for (let image of imagesArray) {

                let dirPath = `/files/posts/${path.parse(image.name).name}${Date.now()}${path.parse(image.name).ext}`

                let urlPath = path.join(__dirname,`../${dirPath}`);

                await image.mv(urlPath);

                imagePaths.push(dirPath);
            }
        }

        const new_post = new Post({
            user : {
                id : user._id,
                fullName : user.fullName
            },
            imagePaths,
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
        return res.status(422).json({
            success : false,
            message : error.message
        });
    }

};

const getPosts = async (req,res) => {
    try {
        
        const posts = await Post.find({isDeleted : false});

        return res.json({
            success : true,
            message : '',
            data : {
                posts
            }
        });

    } catch (error) {
        return res.status(422).json({
            success : false,
            message : error.message
        });
    }
};

const getPost = async(req,res) => {
    try {

        const _id = req.params.id;

        const post = await Post.findOne({_id,isDeleted:false});

        if(!post){
            return res.status(404).json({
                success : false,
                message : 'Post Not Found'
            });
        }

        return res.json({
            success : true,
            message : '',
            data : {
                post
            }
        });
        
    } catch (error) {
        return res.status(422).json({
            success : false,
            message : error.message
        });
    }
};

const deletePost = async( req, res) => {

    try {
        
        const _id = req.params.id;
        
        const post = await Post.findOne({_id,isDeleted:false});
        
        if(!post){
            return res.status(404).json({
                success : false,
                message : 'POST NOT FOUND'
            });
        }

        const user = req.user;

        if(user._id !== post.user.id.toHexString()){
            return res.status(401).json({
                success : false,
                message : 'This Post cannot be deleted by you'
            });
        }

        post.isDeleted = true;

        await post.save();

        return res.json({
            success : true,
            message : 'Post deleted successfully',
            data : {}
        });

    } catch (error) {
        return res.status(422).json({
            success : false,
            message : error.message
        });
    }

}

const editPost = async (req,res) => {

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

        const _id = req.params.id;
        
        const post = await Post.findOne({_id,isDeleted:false});
        
        if(!post){
            return res.status(404).json({
                success : false,
                message : 'POST NOT FOUND'
            });
        }

        const user = req.user;

        if(user._id !== post.user.id.toHexString()){
            return res.status(401).json({
                success : false,
                message : 'This Post cannot be deleted by you'
            });
        }

        post.postMessage = req.body.postMessage;
        
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
    getPosts,
    getPost
};