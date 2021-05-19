const request = require("supertest");
const expect = require('expect');

const {app} = require('../server');
const { User } = require("../models/User");
const {  populateUsers } = require("./seeds/seed");

beforeEach(populateUsers);

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
            console.log(res.body);
            expect(res.body.success).toBe(true);
        })
        .end(err => {
            if(err){
                return done(err)
            }

            User.find().then(users => {
                expect(users).toHaveLength(3);
                expect(users[2].email).toEqual(email);
                done();
              }).catch((e) => done(e));
        });
    });

    it('should return 400 for incomplete parameters provided', (done) => {

        request(app)
            .post('/auth/register')
            .send({})
            .expect(400)
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

    it('should return 422 for using already existing emails', (done) => {

        request(app)
            .post('/auth/register')
            .send({ fullName : 'Sapa King',email : 'sapa@test.com' ,password:'1235678'})
            .expect(422)
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

describe('POST /auth/login', () => {
    
    it('should successfully login', (done) => {
        
        var email = "sapa@test.com";
        var password = "userOnePass";
        request(app)
        .post('/auth/login')
        .send({email,password})
        .expect(200)
        .expect(res => {
            expect(res.body.success).toBe(true);
            expect(res.body._token).toBeTruthy();
        })
        .end(err => {
            if(err){
                console.log(err.message);
                return done(err);
            }
            done();
        });
    });

    it('should return 400 for incomplete parameters provided', (done) => {

        request(app)
            .post('/auth/login')
            .send({password:'1235'})
            .expect(400)
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

    it('should return 404 for invalid user', (done) => {

        request(app)
            .post('/auth/login')
            .send({email : 'sissy@test.com',password:'userOnePass'})
            .expect(404)
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

    it('should return 400 for invalid credentials', (done) => {

        request(app)
            .post('/auth/login')
            .send({email : 'sapa@test.com',password:'fakepassword'})
            .expect(400)
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