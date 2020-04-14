const supertest = require('supertest');
const Async = require('async');

describe('VolunteerController', () => {

  let cookie;
  let eventId;
  let stationID;
  let volunteerID;

  // Policy Check: 

  // create group Volunteer
  describe(`Policy Check: #createGroup() without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .post('/volunteer/group')
        .send('Volunteer[vGroupName]=HKBU-CSS&Volunteer[vGroupAddress]=KowloonTong&Station[sName]=TSW-S1&Volunteer[vName]=Harris&Volunteer[vContact]=66248899&Volunteer[vType]=group&Volunteer[isContacter]=true')
        .expect(403, done);
    });
  });

  // create group Volunteer
  describe(`#createGroup() Volunteer[vGroupName]=HKBU-CSS&Volunteer[vGroupAddress]=KowloonTong&Station[sName]=TSW-S1&Volunteer[vName]=Harris&Volunteer[vContact]=66248899&Volunteer[vType]=group&Volunteer[isContacter]=true with admin1 login`, () => {
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
            .post('/volunteer/group')
            .set('Cookie', cookie)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('Volunteer[vGroupName]=HKBU-CSS&Volunteer[vGroupAddress]=KowloonTong&Station[sName]=TSW-S1&Volunteer[vName]=Harris&Volunteer[vContact]=66248899&Volunteer[vType]=group&Volunteer[isContacter]=true')
            .expect(200).then(() => {
              Volunteer.findOne({ where: { vGroupName: 'HKBU-CSS' } }).then(model => {
                if (model) {
                  volunteerID = model.id;
                  return cb();
                }
                return cb(new Error('Can\'t create group named - HKBU-CSS'));
              });
            });
        }
      ], done);
    });
  });




});