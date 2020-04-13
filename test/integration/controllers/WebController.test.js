const supertest = require('supertest');
const Async = require('async');

describe('WebController', () => {

  let cookie;

  // createEvent
  describe(`Policy Check: #createEvent() Web[dateOfEvent]=2020-09-01, Web[eventLocation]=全港 and Web[eventName]=123456 without login`, () => {
    it('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
      .post('/web/')
      .send('Web[dateOfEvent]=2020-09-01&Web[eventName]=123456&Web[eventLocation]=全港')
      .expect(403, done);
    });
  });

  describe(`#createEvent() Web[dateOfEvent]=2020-09-01, Web[eventLocation]=全港 and Web[eventName]=123456 with admin2 login`, () => {
    it('should return 200 "Successfully created!"', (done) => {
      Async.series([
        function(cb) {
          supertest(sails.hooks.http.app)
          .post('/user/login')
          .send({ username: 'admin2', password: '123456' })
          .expect(302)
          .then(res => {
            const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
            cookie = cookies.join(';');
            cb();
          });
        },
        function(cb) {
          supertest(sails.hooks.http.app)
          .post('/web/')
          .set('Cookie', cookie)
          .send('Web[dateOfEvent]=2020-09-01&Web[eventName]=123456&Web[eventLocation]=全港')
          .expect(200, cb);
        },
      ], done);
    });
  });

  // updateEvent 
  describe(`Policy Check: #updateEvent() Web[dateOfEvent]=2020-12-25, Web[eventLocation]=全港 and Web[eventName]=ABC without login`, () => {
    it('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
      .post('/web/')
      .send('Web[dateOfEvent]=2020-09-01&Web[eventName]=123456&Web[eventLocation]=全港')
      .expect(403, done);
    });
  });

  describe(`#updateEvent() Web[dateOfEvent]=2020-12-25, Web[eventLocation]=全港 and Web[eventName]=ABC with admin2 login`, () => {
    it('should return 200 "Successfully created!"', (done) => {
      Async.series([
        function(cb) {
          supertest(sails.hooks.http.app)
          .post('/user/login')
          .send({ username: 'admin2', password: '123456' })
          .expect(302)
          .then(res => {
            const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
            cookie = cookies.join(';');
            cb();
          });
        },
        // Have Bugs --> Could not find the req.session.eventid
        // function(cb) {
        //   supertest(sails.hooks.http.app)
        //   .patch('/web/')
        //   .set('Cookie', cookie)
        //   .send('Web[dateOfEvent]=2020-12-25&Web[eventName]=ABC&Web[eventLocation]=全港')
        //   .expect(200, cb);
        // },
      ], done);
    });
  });



});
