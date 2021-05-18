const { request } = require("super");
const { User } = require("../models/user");
const { users } = require("./seeds/seed");

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

            // User.findById(users[])
        });
    });

});