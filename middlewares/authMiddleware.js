const {client} = require('../config/Redis');
const jwt = require('jsonwebtoken');

const { User } = require('../models/User');

const auth = async (req,res,next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                success : false,
                message : 'AUTHORIZATION Header not found'
            });
        }

        const token = authHeader.split(' ')[1];

        const payload = jwt.verify(token, process.env.JWT_SECRET);
    
        if(!payload){
            return res.status(401).json({
                success : false,
                message : 'Invalid payload'
            });
        }

        const data = await client.getAsync(payload.id);
        
        if(data){
            req.user = JSON.parse(data);

            return next();
        }

        // get the user from 
        const user = await User.findOneByToken(token);

        if(user){
            client.set(user._id,user);
    
            req.user = user;
    
            return next();
        }


        return res.status(401).json({
            success : false,
            message : "Invalid user access"
        });

    } catch (error) {
        // error 
        res.status(422).json({
            success : false,
            message : error.message
        });
    }
};

module.exports = {
    auth
};