const {client} = require('../config/Redis');
const jwt = require('jsonwebtoken');

const auth = async (req,res,next) => {
    try {
        const token = req.body.header;


        if(!token || token === undefined){
            throw new Error('No token was sent')
        }

        const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    
        if(!payload){
            
        }

        const data = await client.getAsync(payload.id)
        
        if(!data){
            // log the error
            return res.status(401).json({
                error : true,
                message : "Invalid user access",
                data :{}
            });
        }

        next();
    } catch (error) {
        // error 
        res.status(422).json({
            error : true,
            message : error.message,
            data :{}
        });
    }
};

module.exports = {
    auth
};