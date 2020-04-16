/* eslint-disable callback-return */
const supertest = require('supertest');
const Async = require('async');

describe('StationController', () => {

  let cookie;
  let eventId;
  let stationID;

  // Policy Check:

  // createStation
  describe(`Policy Check: #createStation() Station[sName]=TSW-S2, Station[numOfSpareBag]=6, Station[sLocation]=HK, User[username]=stationmgr2 without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .post('/addflagstn')
        .send('Station[sName]=TSW-S2&Station[numOfSpareBag]=6&Station[sLocation]=HK&User[username]=stationmgr2')
        .expect(403, done);
    });
  });

  // UpdateStation
  describe(`Policy Check: #updateStation() without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .get('/updateStation/' + stationID)
        .expect(403, done);
    });
  });

  // DeleteStation
  describe(`Policy Check: #deleteStation() Station[sName]=TSW-S4, Station[numOfSpareBag]=3, Station[sLocation]=HKL, User[username]=stationmgr2 without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .delete('/station/' + stationID)
        .expect(403, done);
    });
  });

  // viewStation
  describe(`Policy Check: #viewStation() view all stations in an event without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .get('/station/' + eventId)
        .expect(403, done);
    });
  });

  // viewSpecificStation
  describe(`Policy Check: #viewSpecificStation() view Station[sName]=TSW-S1 without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .get('/viewStation/' + stationID)
        .expect(403, done);
    });
  });

  // createStation
  describe(`#createStation() Station[sName]=TSW-S3, Station[numOfSpareBag]=6 and Station[sLocation]=HK, User[username]=stationmgr2 with admin1 login`, () => {
    step('should return 200 "Successfully created!"', (done) => {
      Async.series([
        function (cb) {
          supertest(sails.hooks.http.app)
            .post('/user/login')
            .send({ username: 'admin1', password: '123456' })
            .expect(302)
            .then(res => {
              const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
              cookie = cookies.join(';');
              cb();
            });
        },
        function (cb) {
          Web.findOne({ where: { eventName: '齊抗武漢肺炎賣旗活動' } }).then(model => {
            if (model) {
              eventId = model.id;
            }
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
          supertest(sails.hooks.http.app)
            .post('/addflagstn/')
            .set('Cookie', cookie)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('Station[sName]=TSW-S3&Station[numOfSpareBag]=6&Station[sLocation]=HK&User[username]=stationmgr2')
            .expect(200).then(() => {
              Station.findOne({ where: { sName: 'TSW-S3' } }).then(model => {
                if (model) {
                  stationID = model.id;
                  return cb();
                }
                return cb(new Error('Can\'t find TSW-S3'));
              });
            });
        }
      ], done);
    });
  });


  // updateStation
  describe(`#updateStation() Station[sName]=TSW-S4, Station[numOfSpareBag]=3, Station[sLocation]=HKL, User[username]=stationmgr2 with admin1 login`, () => {
    step('should return 200 "Successfully updated!"', (done) => {
      Async.series([
        function (cb) {
          Web.findOne({ where: { eventName: '齊抗武漢肺炎賣旗活動' } }).then(model => {
            if (!model) {
              cb(new Error(` { eventName: '齊抗武漢肺炎賣旗活動' } not found`));
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
          Station.findOne({ where: { sName: 'TSW-S3' } }).then(model => {
            if (!model) {
              cb(new Error(` Station { sName: 'TSW-S3' } not found`));
            }
            stationID = model.id;
            cb();
          });
        },
        function (cb) {
          supertest(sails.hooks.http.app)
            .patch('/station/' + stationID)
            .set('Cookie', cookie)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('Station[sName]=TSW-S4&Station[numOfSpareBag]=3&Station[sLocation]=HKL&User[username]=stationmgr2')
            .expect(200).then(() => {
              Station.findOne({ where: { sName: 'TSW-S4' } }).then(model => {
                if (model) {
                  stationID = model.id;
                  return cb();
                } else {
                  return cb(new Error('Can\'t find TSW-S4'));
                }
              });
            });
        }
      ], done);
    });
  });

  // deleteStation
  describe(`#deleteStation() Station[sName]=TSW-S4, Station[numOfSpareBag]=3, Station[sLocation]=HKL, User[username]=stationmgr2 admin1 login`, () => {
    step('should return 200 "Successfully deleted!"', (done) => {
      Async.series([
        function (cb) {
          Web.findOne({ where: { eventName: '齊抗武漢肺炎賣旗活動' } }).then(model => {
            if (!model) {
              cb(new Error(` { eventName: '齊抗武漢肺炎賣旗活動' } not found`));
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
          Station.findOne({ where: { sName: 'TSW-S4' } }).then(model => {
            if (!model) {
              cb(new Error(` Station { sName: 'TSW-S4' } not found`));
            }
            stationID = model.id;
            cb();
          });
        },
        function (cb) {
          supertest(sails.hooks.http.app)
            .delete('/station/' + stationID)
            .set('Cookie', cookie)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .expect(200).then(() => {
              Station.findOne({ where: { sName: 'TSW-S4' } }).then(model => {
                if (!model) {
                  return cb();
                } else {
                  cb(new Error('Can\'t delete TSW-S4'));
                }
              });
            });
        }
      ], done);
    });
  });

  // viewStation (/station/:id)
  describe(`#viewStation() view all the station in this event with admin1 login`, () => {
    step('should return 200 "Successfully viewed!"', (done) => {
      Async.series([
        function (cb) {
          Web.findOne({ where: { eventName: '齊抗武漢肺炎賣旗活動' } }).then(model => {
            if (model) {
              eventId = model.id;
            }
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
          supertest(sails.hooks.http.app)
            .get('/station/' + eventId)
            .set('Cookie', cookie)
            .expect(200).then(() => {
              Station.find().then(model => {
                if (model) {
                  stationID = model.id;
                  return cb();
                }
                else {
                  cb(new Error('Can\'t view any station'));
                }
              });
            });
        }
      ], done);
    });
  });

  // viewSpecificStation (/viewStation/:id)
  describe(`#viewSpecificStation() view a specific station in this event with admin1 login`, () => {
    step('should return 200 "Successfully viewed!"', (done) => {
      Async.series([
        function (cb) {
          Web.findOne({ where: { eventName: '齊抗武漢肺炎賣旗活動' } }).then(model => {
            if (model) {
              eventId = model.id;
            }
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
          Station.findOne({ where: { sName: 'TSW-S1' } }).then(model => {
            if (model) {
              stationID = model.id;
            }
            cb();
          });
        },
        function (cb) {
          supertest(sails.hooks.http.app)
            .get('/viewStation/' + stationID)
            .set('Cookie', cookie)
            .expect(200).then(() => {
              Station.findOne({ where: { sName: 'TSW-S1' } }).then(model => {
                if (model) {
                  stationID = model.id;
                  return cb();
                }
                else {
                  cb(new Error('Can\'t view any station'));
                }
              });
            });
        }
      ], done);
    });
  });


});
