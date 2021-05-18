const { request } = require("supertest");

describt('POST /', () => {

    it('should create a post', done => {

        request(app)
            .post('/posts/create')

    });

});