//  Test the initial data inserted in config/bootstrap.js
describe('User (model) initial data', () => {

  describe('Admin user', () => {
    it('should find User with username "admin1"', (done) => {
      User.find({ username: 'admin1' })
                .then((users) => {

                  if (users.length == 0) {
                    return done(new Error(
                            'Should return 1 user with username -- admin1 ' +
                            'But instead, got: no user found'
                    ));
                  }
                  return done();
                })
                .catch(done);
    });
  });

  describe('Admin user', () => {
    it('should find User with username "admin2"', (done) => {
      User.find({ username: 'admin2' })
                .then((users) => {

                  if (users.length == 0) {
                    return done(new Error(
                            'Should return 1 user with username -- admin2 ' +
                            'But instead, got: no user found'
                    ));
                  }
                  return done();
                })
                .catch(done);
    });
  });

  describe('Stationmgr user', () => {
    it('should find User with username "stationmgr1"', (done) => {
      User.find({ username: 'stationmgr1' })
                .then((users) => {

                  if (users.length == 0) {
                    return done(new Error(
                            'Should return 1 user with username -- stationmgr1 ' +
                            'But instead, got: no user found'
                    ));
                  }
                  return done();
                })
                .catch(done);
    });
  });

  describe('Stationmgr user', () => {
    it('should find User with username "stationmgr2"', (done) => {
      User.find({ username: 'stationmgr2' })
                .then((users) => {

                  if (users.length == 0) {
                    return done(new Error(
                            'Should return 1 user with username -- stationmgr2 ' +
                            'But instead, got: no user found'
                    ));
                  }
                  return done();
                })
                .catch(done);
    });
  });

  describe('Stationmgr user', () => {
    it('should find User with username "stationmgr3"', (done) => {
      User.find({ username: 'stationmgr3' })
                .then((users) => {

                  if (users.length == 0) {
                    return done(new Error(
                            'Should return 1 user with username -- stationmgr3 ' +
                            'But instead, got: no user found'
                    ));
                  }
                  return done();
                })
                .catch(done);
    });
  });

});
