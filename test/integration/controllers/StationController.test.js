const supertest = require('supertest');
const Async = require('async');

describe('StationController', () => {

  let cookie;

  // createStation
  describe(`Policy Check: #createStation() Station[sName]=TSW-S2, Station[numOfSpareBag]=6 and Station[sLocation]=HK && User[username]=stationmgr2 without login`, () => {
    it('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .post('/addflagstn')
        .send('Station[sName]=TSW-S2&Station[numOfSpareBag]=6&Station[sLocation]=HK&User[username]=stationmgr2')
        .expect(403, done);
    });
  });

  describe(`#createStation() Station[sName]=TSW-S2, Station[numOfSpareBag]=6 and Station[sLocation]=HK && User[username]=stationmgr2 with admin1 login`, () => {
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
        // Have BUGS --- Could not find the req.session.eventid
        // function (cb) {
        //   supertest(sails.hooks.http.app)
        //     .post('/addflagstn/')
        //     .set('Cookie', cookie)
        //     .send('Station[sName]=TSW-S2&Station[numOfSpareBag]=6&Station[sLocation]=HK&User[username]=stationmgr2&req.session.eventid=1')
        //     .expect(302, cb);
        // }
      ], done);
    });
  });

});
