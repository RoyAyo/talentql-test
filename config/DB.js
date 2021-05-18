const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI =  process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

const db = mongoose.connect(MONGO_URI,{useUnifiedTopology:true, useNewUrlParser:true}).then(() => {
    console.log('Connected successfully to Database');
}).catch(e => {
    console.log(e);
});

module.exports = db;