const supertest = require('supertest');
const Async = require('async');

describe('StationController', () => {

  let cookie;
  let eventId;

  // createStation
  describe(`Policy Check: #createStation() Station[sName]=TSW-S2, Station[numOfSpareBag]=6 and Station[sLocation]=HK && User[username]=stationmgr2 without login`, () => {
    it('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .post('/addflagstn')
        .send('Station[sName]=TSW-S2&Station[numOfSpareBag]=6&Station[sLocation]=HK&User[username]=stationmgr2')
        .expect(403, done);
    });
  });

  describe(`#createStation() Station[sName]=TSW-S3, Station[numOfSpareBag]=6 and Station[sLocation]=HK && User[username]=stationmgr2 with admin1 login`, () => {
    it('should return 200 "Successfully created!"', (done) => {
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
          Web.findOne({where: {eventName: '齊抗武漢肺炎賣旗活動'} }).then(model => {
            if (model) {
              eventId = model.id;
            }
            cb();
          });
        },
        function (cb) {
          supertest(sails.hooks.http.app)
          .get('/viewitem/'+eventId)
          .set('Cookie', cookie)
          .expect(200, cb);
        },
        
        // Have BUGS --- Could not find the req.session.eventid
        function (cb) {
          supertest(sails.hooks.http.app)
            .post('/addflagstn/')
            .set('Cookie', cookie)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('Station[sName]=TSW-S3&Station[numOfSpareBag]=6&Station[sLocation]=HK&User[username]=stationmgr2')
            .expect(302).then(() => {
              Station.findOne( {where: { sName: 'TSW-S3' }}).then(model => {
                if (model) {
                  return cb();
                }
                return cb(new Error('Can\'t find TSW-S3'));
              });
            });
        }
      ], done);
    });
  });

});
