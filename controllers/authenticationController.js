const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Validator} = require('node-input-validator');


const {User} = require('../models/User');
const {client} = require('../config/Redis');
const { sendEmailQueue } = require('../config/Queue');

const registerUser = async(req,res) => {
    try {

        const validate = new Validator(req.body,{
            'fullName' : 'required|string',
            'email' : 'required|string|email',
            'password' : 'required|string'
        });

        const matched = await validate.check();

        if(!matched){
            return res.status(400).json({
                success:false,
                message: validate.errors
            });
        }

        const {
            fullName,
            email,
            password
        } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        const user = new User({fullName,email,password:hashPassword});

        const new_user = await user.save();
        
        const token = await new_user.generateAuthToken();

        if(client){
            client.set(`${user._id.toHexString()}`,JSON.stringify(new_user));
        }

        // send email
        const link = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'; 
        const email_token = jwt.sign({email},'salt-secret');
        const html = `<h4>Please Help Verify this email</h4><p>${link}/auth/email/verify/${email_token}</p>`
        sendEmailQueue.add({email,html});

        return res.json({
            success : true,
            message : 'User sucucessfully registered, Verification Email sent',
            _token : token
        });
        
    } catch (error) {
        return res.status(422).json({
            success:false,
            message: error.message
        });
    }
};

const loginUser = async (req,res) => {
    try {
        const validate = new Validator(req.body,{
            'email' : 'required|string',
            'password' : 'required|string'
        });

        const matched = await validate.check();

        if(!matched){
            return res.status(400).json({
                success:false,
                message: validate.errors
            });
        } 

        const user = await User.findOne({email : req.body.email});

        if(!user){
            return res.status(404).json({
                success : false,
                message : 'User not found'
            });
        }

        const valid_user = await bcrypt.compare(req.body.password,user.password);

        if(!valid_user){
            return res.status(400).json({
                success : false,
                message : 'Invalid credentials'
            });
        }

        const token = await user.generateAuthToken();

        return res.json({
            success : true,
            message : 'User Logged In successfully',
            _token : token
        });

    } catch (error) {
        return res.status(422).json({
            success : false,
            message : error.message
        });
    }
};

const verifyEmail = async (req,res) => {
    try {
        const verify_token = req.params.token;

        const salt = 'salt-secret';

        const payload = jwt.verify(verify_token,salt);

        if(!payload){
            return res.status(400).json({
                success : false,
                message : 'Invalid Token Provided'
            });
        }

        const user = await User.findOne({email:payload.email});

        if(user.emailVerified){
            return res.status(400).json({
                success : false,
                message : 'User email already verified'
            });
        }

        user.emailVerified = true;

        await user.save();

        return res.json({
            success : true,
            message : 'Email verified successfully'
        });

        
    } catch (error) {
        return res.status(422).json({
            success : false,
            message : error.message
        });
    }
};

const passwordForgot = async (req,res) => {
    try {
        
        const validate = new Validator(req.body,{
            'email' : 'required|string',
        });

        const matched = await validate.check();

        if(!matched){
            return res.status(400).json({
                success:false,
                message: validate.errors
            });
        }

        const user = await User.findOne({email:req.body.email});

        if(!user){
            return res.status(404).json({
                success : false,
                message : 'User not found'
            });
        }

        // get users previous hashed password to ensure token is only used once
        const hashed = user.password;
        const id = user._id;

        const verifyToken = jwt.sign({id,password:hashed},'secret_salt');

        // send email
        const link = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'; 
        const html = `<h4>This is a link to Change your password, valid only once</h4><p>${link}/password/change/${verifyToken}</p>`
        sendEmailQueue.add({email:req.body.email,html});
        
        return res.json({
            success : true,
            message : 'Password Reset email successfully sent'
        })

    } catch (error) {
        res.status(422).json({
            success : false,
            message : error.message
        });
    }
};

const passwordReset = async (req,res) => {
    try {
        
        const validate = new Validator(req.body,{
            'verify_token' : 'required|string',
            'password' : 'required|string',
            'confirmPassword' : 'required|string'
        });

        const matched = await validate.check();

        if(!matched){
            return res.status(400).json({
                success:false,
                message: validate.errors
            });
        }

        if(req.body.password !== req.body.confirmPassword){
            return res.status(400).json({
                success : false,
                message : 'Passwords do not match'
            });
        }

        const payload = jwt.verify(req.body.verify_token,'secret_salt');

        if(!payload){
            return res.status(401).json({
                success : false,
                message : 'Invalid Token Provided'
            });
        }

        const id = payload.id;

        const user = await User.findById(id);

        // ensure the token is only valid once(i.e password in payload hasn't changed)
        if(payload.password !== user.password){
            return res.status(403).json({
                success : false,
                message : 'The password link has already been used'
            });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password,salt);

        user.password = hashPassword;

        await user.save();

        return res.json({
            success : true,
            message : 'Password changed successfully'
        });


    } catch (error) {
        res.status(422).json({
            success : false,
            message : error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    passwordForgot,
    passwordReset
};