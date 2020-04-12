const supertest = require('supertest');

describe('UserController', () => {

  describe('#login() with admin account', () => {
    it('should return status 200', (done) => {
      supertest(sails.hooks.http.app)
                .post('/user/login')
                // The following two lines making the request as normal form submission instead of AJAX request
                .set('Accept', 'text/html,application/xhtml+xml,application/xml')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('username=admin1&password=123456')
                .expect(200, 'Login successfully on admin', done);
    });
  });

  describe('#login() with station account', () => {
    it('should return status 200', (done) => {
      supertest(sails.hooks.http.app)
                .post('/user/login')
                // The following two lines making the request as normal form submission instead of AJAX request
                .set('Accept', 'text/html,application/xhtml+xml,application/xml')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('username=stationmgr3&password=123456')
                .expect(200, 'Login successfully on station', done);
    });
  });

  describe('#login() with non-exists user account', () => {
    it('should return status 401 with "User not found" in body', (done) => {
      supertest(sails.hooks.http.app)
                .post('/user/login')
                .send('username=testing&password=123456')
                .expect(401, '使用者名稱或密碼不正確', done);
    });
  });

  describe('#logout()', () => {
    it('should return status 200 in body', (done) => {
      supertest(sails.hooks.http.app)
                .post('/user/login')
                .set('Accept', 'text/html,application/xhtml+xml,application/xml')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send('username=admin1&password=123456')
                .expect(200, 'Login successfully on admin', done)
                .get('/user/logout')
                .expect(200, done);
    });
  });

});
