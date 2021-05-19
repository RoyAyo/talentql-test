const request = require("supertest");
const expect = require('expect');
const jwt = require('jsonwebtoken');
const { Post } = require("../models/Post");

const {app} = require('../server');
const { populatePosts, posts, users } = require("./seeds/seed");

const token = jwt.sign({id:users[0]._id.toHexString()},process.env.JWT_SECRET);

beforeEach(populatePosts);

describe('POST /posts/create', () => {

    const postMessage = "This is a new Test Message";

    it('should return 401 without any header token set', done => {

        request(app)
            .post('/posts/create')
            .field('postMessage',postMessage)
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

    it('should return 401 with an invalid token', done => {

        request(app)
            .post('/posts/create')
            .field('postMessage',postMessage)
            .set('AUTHORIZATION',`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTNlYWExZDQxOTQyMmRlMDc3YzUyYSIsImlhdCI6MTYyMTM1NTE3OX0.AvcFRmgOT_NQ0v137UFAprMZhYpzo3vh-Utw5LyhzW7`)
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
    
    it('should create a post w/o images', done => {

        request(app)
            .post('/posts/create')
            .field('postMessage',postMessage)
            .set('AUTHORIZATION',`Bearer ${token}`)
            .expect(200)
            .expect(res => {
                console.log(res.body);
                expect(res.body.success).toBe(true);
            })
            .end(err => {
                if(err){
                    return done(err);
                }

                Post.find({}).then(posts => {
                    expect(posts).toHaveLength(3);
                    expect(posts[2].postMessage).toEqual(postMessage);
                    done();
                }).catch((e) => done(e));
            });

    });

    it('should return 400 without parameters', done => {

        request(app)
            .post('/posts/create')
            .set('AUTHORIZATION',`Bearer ${token}`)
            .expect(400)
            .expect(res => {
                expect(res.body.success).toBe(false);
            })
            .end(err => {
                if(err){
                    return done(err);
                }

                Post.find({}).then(posts => {
                    expect(posts).toHaveLength(2);
                    done();
                }).catch((e) => done(e));
            });

    });

});

describe('GET /posts', () => {

    it('should get all posts successfully', (done) => {

        request(app)
            .get('/posts')
            .expect(200)
            .expect(res => {
                expect(res.body.success).toBe(true);
                expect(res.body.data.posts).toHaveLength(1);
            })
            .end(err => {
                if(err){
                    return done(err);
                }
                done();
            });
    });
});

describe('GET /posts/post/:id', () => {

    it('should get the post successfully', (done) => {

        request(app)
            .get(`/posts/post/${posts[0]._id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.success).toBe(true);
                expect(res.body.data.post.postMessage).toEqual(posts[0].postMessage);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }
                done();
            });
    });

    it('should return 404 for a deleted post and invalid', (done) => {

        request(app)
            .get(`/posts/post/${posts[1]._id}`)
            .expect(404)
            .expect(res => {
                expect(res.body.success).toBe(false);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }
                done();
            });
    });
});

describe('DELETE /posts/post/:id', () => {

    it('should return 401 without any header token set', done => {

        request(app)
            .delete(`/posts/post/${posts[0]._id}`)
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

    it('should return 401 with an invalid token', done => {

        request(app)
            .delete(`/posts/post/${posts[0]._id}`)
            .set('AUTHORIZATION',`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTNlYWExZDQxOTQyMmRlMDc3YzUyYSIsImlhdCI6MTYyMTM1NTE3OX0.AvcFRmgOT_NQ0v137UFAprMZhYpzo3vh-Utw5LyhzW7`)
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

    it('should delete a post successfully', (done) => {

        request(app)
            .delete(`/posts/post/${posts[0]._id}`)
            .set('AUTHORIZATION',`Bearer ${token}`)
            .expect(200)
            .expect(res => {
                console.log(res.body);
                expect(res.body.success).toBe(true);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }
                Post.findOne({_id:posts[0]._id, isDeleted: false}).then(post => {

                    expect(post).toBeFalsy();
                    
                    done();

                }).catch(e => done(e));
            });
    });

})

describe('PUT /posts/post/:id', () => {

    const postMessage = "Sapa cannot bring me down onG";

    it('should return 401 without any header token set', done => {

        request(app)
            .post('/posts/create')
            .send({postMessage})
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

    it('should return 401 with an invalid token', done => {

        request(app)
            .post('/posts/create')
            .set('AUTHORIZATION',`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTNlYWExZDQxOTQyMmRlMDc3YzUyYSIsImlhdCI6MTYyMTM1NTE3OX0.AvcFRmgOT_NQ0v137UFAprMZhYpzo3vh-Utw5LyhzW7`)
            .send({postMessage})
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

    it('should successfully modify post', (done) => {

        request(app)
            .put(`/posts/post/${posts[0]._id}`)
            .set('AUTHORIZATION',`Bearer ${token}`)
            .send({postMessage})
            .expect(200)
            .expect(res => {
                expect(res.body.success).toBe(true);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }

                Post.findById(posts[0]._id).then(post => {
                    expect(post.postMessage).toEqual(postMessage);
                    done();
                }).catch(e => done(e));
            });
    });    

    it('should return 404 for a deleted post and invalid', (done) => {

        request(app)
            .put(`/posts/post/${posts[1]._id}`)
            .set('AUTHORIZATION',`Bearer ${token}`)
            .send({postMessage})
            .expect(404)
            .expect(res => {
                expect(res.body.success).toBe(false);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }
                done();
            });
    });

    it('should return 400 without parameters', done => {

        request(app)
            .put(`/posts/post/${posts[1]._id}`)
            .set('AUTHORIZATION',`Bearer ${token}`)
            .expect(400)
            .expect(res => {
                expect(res.body.success).toBe(false);
            })
            .end(err => {
                if(err){
                    return done(err);
                }

                Post.find({}).then(posts => {
                    expect(posts).toHaveLength(2);
                    done();
                }).catch((e) => done(e));
            });

    });

})