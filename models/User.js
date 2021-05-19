/** @format */

const {Schema, model} = require("mongoose");
const jwt = require('jsonwebtoken');

const UserSchema = Schema(
  {
    // User Id that wants User
    fullName : {
        type : String,
        required : [true,'Name is required'],
        minlength: ["3", "Username must be at least 3 characters"]
    },

    email : {
        type : String,
        required: [true, "Email is required"],
        unique: [true, "Email already in use."],
        lowercase: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ],
    },
    
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: 7
      },

      emailVerified : {
          type : Boolean,
          default : false
      }
  },
  {
    timestamps: true,
  }
)

UserSchema.statics.findOneByToken = async function(token){

    try {
        
        const User = this;

        const secret = process.env.JWT_SECRET;

        const payload = await jwt.verify(token, secret);

        return User.findOne({_id:payload.id});

    } catch (error) {
        return Promise.reject(error.message);
    }

};

UserSchema.methods.generateAuthToken = async function(){

    try {
        
            const user = this;

            const secret = process.env.JWT_SECRET;

            const {
                _id
            } = user;

            const token = jwt.sign({id:_id.toHexString()},secret);

            return token;

    } catch (error) {
        return Promise.reject(error.message)
    }

};

const User = model("users", UserSchema);

module.exports = {
  User
};