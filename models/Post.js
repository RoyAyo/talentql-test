/** @format */

const {Schema, model} = require("mongoose");

const PostSchema = Schema(
  {
    user : {
        id : Schema.Types.ObjectId,
        name : {
            type : String,
            required : true
        }
    },

    post : {
        type : String
    },

    imgaePaths : [
        {
            type : String
        }
    ],

    isDeleted : {
      type : Boolean,
      default : false
    }
  },
  {
    timestamps: true,
  }
)


const Post = model("Post", PostSchema)

module.exports = {
  Post
};