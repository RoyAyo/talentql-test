/** @format */

const {Schema, model} = require("mongoose");

const PostSchema = Schema(
  {
    user : {
        id : Schema.Types.ObjectId,
        fullName : {
            type : String,
            required : true
        }
    },

    postMessage : {
        type : String,
        required : true
    },

    imagePaths : [
        {
            type : String
        }
    ],

    isDeleted : {
      type : Boolean,
      default : false,
      select : false
    }
  },
  {
    timestamps: true,
  }
)


const Post = model("posts", PostSchema)

module.exports = {
  Post
};