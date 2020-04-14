const supertest = require('supertest');
const Async = require('async');

let eventId;

describe('WebController', () => {

  let cookie;

  // Policy Check: 

  // createEvent
  describe(`Policy Check: #createEvent() Web[dateOfEvent]=2020-09-01, Web[eventLocation]=全港, Web[eventName]=123456 without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .post('/web/')
        .send('Web[dateOfEvent]=2020-09-01&Web[eventName]=123456&Web[eventLocation]=全港')
        .expect(403, done);
    });
  });

  // updateEvent 
  describe(`Policy Check: #updateEvent() Web[dateOfEvent]=2020-01-18, Web[eventLocation]=全港, Web[eventName]=HappyEvent without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .get('/updateEvent/' + eventId)
        .expect(403, done);
    });
  });

  // viewEvent 
  describe(`Policy Check: #viewEvent() view all the events without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .get('/management')
        .expect(403, done);
    });
  });

  // DeleteEvent
  describe(`Policy Check: #deleteEvent() delete a particular event without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .delete('/web/' + eventId)
        .expect(403, done);
    });
  });


  // createEvent
  describe(`#createEvent() Web[dateOfEvent]=2020-09-01, Web[eventLocation]=全港, Web[eventName]=123456 with admin2 login`, () => {
    step('should return 200 "Successfully created!"', (done) => {
      Async.series([
        function (cb) {
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
        function (cb) {
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
  describe(`#updateEvent() Web[dateOfEvent]=2020-01-18, Web[eventName]=HappyEvent, Web[eventLocation]=全港 with admin1 login`, () => {
    step('should return 200 "Successfully updated!"', (done) => {
      Async.series([
        function (cb) {
          Web.findOne({ where: { eventName: '123456' } }).then(model => {
            if (model) {
              eventId = model.id;
              cb();
            } else {
              cb(new Error(` { eventName: '123456' } not found`));
            }
          });
        },
        function (cb) {
          supertest(sails.hooks.http.app)
            .patch('/web/' + eventId)
            .set('Cookie', cookie)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('Web[dateOfEvent]=2020-01-18&Web[eventName]=HappyEvent&Web[eventLocation]=全港')
            .expect(200).then(() => {
              Web.findOne({ where: { eventName: 'HappyEvent' } }).then(model => {
                if (model) {
                  eventId = model.id;
                  cb();
                } else {
                  cb(new Error('Can\'t find HappyEvent'));
                }
              });
            });
        }
      ], done);
    });
  });

  // viewEvent (/management)
  describe(`#viewEvent() view a particular event with admin1 login`, () => {
    step('should return 200 "Successfully viewed!"', (done) => {
      Async.series([
        function (cb) {
          supertest(sails.hooks.http.app)
            .get('/management')
            .set('Cookie', cookie)
            .expect(200).then(() => {
              Web.find().then(model => {
                if (model) {
                  return cb();
                }
                else {
                  cb(new Error('Can\'t view any event'));
                }
              });
            });
        }
      ], done);
    });
  });

  // deleteEvent
  describe(`#deleteEvent() delete Web[eventName]=HappyEvent admin1 login`, () => {
    step('should return 200 "Successfully deleted!"', (done) => {
      Async.series([
        function (cb) {
          Web.findOne({ where: { eventName: 'HappyEvent' } }).then(model => {
            if (!model) {
              cb(new Error(` { eventName: 'HappyEvent' } not found`));
            }
            eventId = model.id;
            cb();
          });
        },
        function (cb) {
          supertest(sails.hooks.http.app)
            .get('/viewitem/' + eventId)
            .set('Cookie', cookie)
            .expect(200, cb);
        },
        function (cb) {
          Web.findOne({ where: { eventName: 'HappyEvent' } }).then(model => {
            if (!model) {
              cb(new Error(` Event { eventName: 'HappyEvent' } not found`));
            }
            eventId = model.id;
            cb();
          });
        },
        function (cb) {
          supertest(sails.hooks.http.app)
            .delete('/web/' + eventId)
            .set('Cookie', cookie)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .expect(200).then(() => {
              Web.findOne({ where: { eventName: 'HappyEvent' } }).then(model => {
                if (!model) {
                  cb();
                } else {
                  cb(new Error('Can\'t delete HappyEvent'));
                }
              });
            });
        }
      ], done);
    });
  });



});
