/** @format */

const {Schema, model} = require("mongoose");
const jwt = require('jsonwebtoken');

const UserSchema = Schema(
  {
    // User Id that wants User
    fullName : {
        type : String,
        required : [true,'Name is required']
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

// UserSchema.pre('save', async function(){

//     if(this.isModified('password')){

//         const salt = await bcrypt.genSalt(10);
//         const hashpassword = await bcrypt.hash(this.password,salt);

//         this.password = hashpassword;

//     };

// });

UserSchema.statics.findOneByToken = async function(){

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

const User = model("User", UserSchema)

module.exports = {
  User
};