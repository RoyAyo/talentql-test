const request = require("supertest");
const expect = require('expect');

const {app} = require('../server');
// const { User } = require("../models/User");
const { users, populateUsers } = require("./seeds/seed");
// beforeEach(populateUsers);

describe('POST /auth/register', () => {

    it('should register a user', (done) => {

        var fullName = "Roy Ayo";
        var email = "test@test.com";
        var password = "password";

        request(app)
        .post('/auth/register')
        .send({fullName,email,password})
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body._token).toExist();
        })
        .end(err => {
            if(err){
                return done(err)
            }

            User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
              }).catch((e) => done(e));
        });
    });
});

describe('POST /auth/login', () => {

    it('should successfully login', (done) => {
        request(app)
        .post('/auth/login')
        .send({email,password})
        .expect(200)
        .expect(res => {
            expect(res.body.success).toBe(true);
            expect(res.body._token).toExist();
        })
        .end(err => {
            if(err){
                return done(err);
            }
            done();
        });
    });

    it('should return 422 for incomplete parameters provided', (done) => {

        request(app)
            .post('/auth/login')
            .send({password})
            .expect(401)
            .expect(res => {
                expect(res.body.success).toBe(false);
            })
            .end(err => {
                if(err){
                    return done(err);
                }
                done();
            });
    });

    it('should return 401 for invalid credentials', (done) => {

        request(app)
            .post('/auth/login')
            .send({email,password:'fake-password'})
            .expect(401)
            .expect(res => {
                expect(res.body.success).toBe(false);
            })
            .end(err => {
                if(err){
                    return done(err);
                }
                done();
            });
    });

});

// describe('/POST /email/verify', () => {

//     it('should successfully verify email'), (done) => {

//         request(app)
//             .get('/email/verify')
//             .expect(200)
//             .expect(res => {
//                 expect(res.body.success).toBe(true);
//             })
//             .end( async(err,res)=> {
//                 try {
                    
//                     if(err){
//                         return done(err);
//                     }
                    
//                     const user = await User.findOne({email:email.users[0].email});
                    
//                     expect(user.emailVerified).toBe(true);
                    
//                     done();

//                 } catch (error) {
//                     done(error);
//                 }
//             });

//     };

// });

// describe('POST /password/forgot', () => {

//     it('should successfully send forgot password', (done) => {

//         request(app)
//             .post('/password/forgot')
//             .send({email})
//             .expect(200)
//             .expect(res => {
//                 expect(res.body.success).toBe(true);
//             })
//             .end(err => {
//                 if(err){
//                     return done(err);
//                 }
//                 done();
//             });
            
//         // mock the send the email queue
//     });

//     it('should return 422 for an invalid email provided', (done) => {

//         request(app)
//             .post('/password/forgot')
//             .send({email:'iamwrong@email.com'})
//             .expect(200)
//             .expect(res => {
//                 expect(res.body.success).toBe(true);
//             })
//             .end(err => {
//                 if(err){
//                     return done(err);
//                 }
//                 done();
//             });

//     });

// });