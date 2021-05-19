# TALENTQL-TEST

## About
This is for the talentql mid-level developer test

## Prerequisites
You will need Redis and Mongodb set up in your local environment to properly run the file, you can install them at : 
- [**Redis**](https://redis.io/download)

- [**Mongodb**](https://docs.mongodb.com/manual/installation/)

## Setting up your application
- Clone this repository into your local environment
```git clone https://github.com/RoyAyo/talentql-test.git```

- Create a .env file in your root project, copy and paste the following
```  NODE_ENV = development
  PORT = 3000
  JWT_SECRET = 'test-secret'
  MONGO_URI = mongodb://localhost:27017/talentqldb
  MONGO_URI_TEST = mongodb://localhost:27017/talentqltestdb
  MAIL_USERNAME = roytest791@gmail.com
  MAIL_PASSWORD = testing-123
```

## Getting Started
- Install the required packages by running 
```npm install```

- You can start the application by running
```npm run start```

- You can run tests for the application by running
```npm run test```

## Documentation
The documentation to using the project can be found [here](https://documenter.getpostman.com/view/6433790/TzRa63kN)
