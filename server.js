const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const fileUpload = require('express-fileupload');
const xss = require("xss-clean");

//load required config
require("dotenv").config();
require('./config/Db');
require('./config/Redis');

// initialization
const app = express();
const PORT = process.env.PORT || 3001;

//all imported global middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(fileUpload({createParentPath:true}));
app.use(mongoSanitize());
app.use(helmet());
app.use(hpp());
app.use(xss());
app.use('/images',express.static(path.join(__dirname, "docs")))

// logging
if (process.env.ENV === "DEVELOPMENT") {
  app.use(morgan("dev"));
}else{
    app.use(morgan("tiny"));
}

// routes
app.get('/', (req,res)=> {
  res.send('api testing')
});
app.use('/auth', require('./routes/api/auth'));
app.use('/post', require('./routes/api/post'));

const server = app.listen(PORT, () => {
  console.log(
    `Server now listening on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close()
})

// Handle unhandled promise rejections
process.on("uncaughtException", (err, promise) => {
  console.error(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1))
})