const bcrypt = require('bcrypt');
const {Validator} = require('node-input-validator');


const {User} = require('../models/User');

const registerUser = async(req,res) => {
    try {

        const validate = new Validator(req.body,{
            'fullName' : 'required|string',
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

        const {
            fullName,
            email,
            password
        } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        const user = new User({fullName,email,hashPassword});

        const new_user = await user.save();

        const token = await new_user.generateAuthToken();

        // add email in queue

        client.set(user._id,user);

        return res.json({
            success : true,
            message : 'User successfully registered',
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
            res.status(404).json({
                success : false,
                message : 'User not found'
            });
        }

        const valid_user = await bcrypt.compare(req.body.password,user.password);

        if(!valid_user){
            res.status(400).json({
                success : false,
                message : 'Invalid credentials'
            });
        }

        const token = User.generateAuthToken();

        return res.json({
            success : true,
            message : 'User Logged In successfully',
            _token : token
        });

    } catch (error) {
        res.status(422).json({
            success : false,
            message : error.message
        });
    }
};

const verifyEmail = async (req,res) => {
    try {

        const validate = new Validator(req.body,{
            'verify_token' : 'required|string',
        });

        const matched = await validate.check();

        if(!matched){
            return res.status(400).json({
                success:false,
                message: validate.errors
            });
        }

        const verify_token = req.body.verify_token;

        const salt = process.env.EMAIL_SECRET;

        const payload = jwt.verify(verify_token,salt);

        if(!payload){
            res.status(400).json({
                success : false,
                message : 'Invalid Token Provided'
            });
        }

        const user = await User.findOne({email:payload.email});

        if(user.emailVerified){
            res.status(400).json({
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
        res.status(422).json({
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

        const user = await User.findOne({email});

        if(!user){
            res.status(404).json({
                success : false,
                message : 'User not found'
            });
        }

        // get users previous hashed password to ensure token is only used once
        const hashed = user.password;
        const id = user._id;

        const verify_token = jwt.sign({id,password:hashed},'secret_salt');

        const url = process.env.ENVIRONMENT = 'production' ? 'http://localhost:3000' : 'http://localhost:3000';

        // send email here..
        
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
            res.status(400).json({
                success : false,
                message : 'Passwords do not match'
            });
        }

        const payload = jwt.verify(req.body.verify_token,'secret-salt');

        if(!payload){
            res.status(401).json({
                success : false,
                message : 'Invalid Token Provided'
            });
        }

        const id = payload._id;

        const user = await User.findById(id);

        // ensure the token is only valid once(i.e password in payload hasn't changed)
        if(payload.password !== user.password){
            res.status(403).json({
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