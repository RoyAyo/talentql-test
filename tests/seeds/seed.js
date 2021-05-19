const {ObjectID} = require('mongodb');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'sinmi@example.com',
  password: 'userOnePass',
}, {
  _id: userTwoId,
  email: 'sixx@example.com',
  password: 'userTwoPass'
}];

const populateUsers = async (done) => {
    await User.remove({});
    
    // await new User(users[0]).save();
    
    // await new User(users[1]).save();
  
    done();

};

module.exports = {
    users,
    populateUsers
};