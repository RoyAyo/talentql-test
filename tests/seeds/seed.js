const {ObjectID} = require('mongodb');
const bcrypt = require('bcrypt');
const {User} = require('./../../models/User');
const {Post} = require('./../../models/Post');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const getSalt = password => {
  const salt = bcrypt.genSaltSync(10);

  const hashed = bcrypt.hashSync(password,salt);

  return hashed;
}

const users = [{
  _id: userOneId,
  fullName: 'Sapa Sapa',
  email: 'sapa@test.com',
  password: getSalt('userOnePass'),
}, {
  _id: userTwoId,
  fullName: 'example Sir',
  email: 'example@example.com',
  password: getSalt('userTwoPas')
}];

const populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

const posts = [{
  _id: new ObjectID(),
  postMessage: 'I like the way you do your things'
}, {
  _id: new ObjectID(),
  postMessage: 'Sapa, how far free me!!'
}];

const populatePosts = (done) => {      
    posts.deleteMany({}).then(() => {
      return Post.insertMany(posts)
    }).then(() => {
      done()
    });

};

module.exports = {
    users,
   populateUsers,
   posts,
   populatePosts
};