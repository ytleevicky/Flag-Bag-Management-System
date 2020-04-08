//  Test the initial data inserted in config/bootstrap.js
describe('User (model) initial data', function() {

    describe('Admin user', function() {
      it('should find User with role "admin"', function (done) {
        User.find({role:'admin'})
        .then(function(users) {
  
          if (users.length == 0) {
            return done(new Error(
              'Should return 1 user with role -- admin '+
              'But instead, got: no user found'
            ));
          }
          return done();
        })
        .catch(done);
      });
    });
  
    describe('Stationmgr user', function() {
      it('should find User with role "stationmgr"', function (done) {
        User.find({role: 'stationmgr'})
        .then(function(users) {
  
          if (users.length == 0) {
            return done(new Error(
              'Should return at least 1 user with role -- stationmgr '+
              'But instead, got: no user found'
            ));
          }
          return done();
        })
        .catch(done);
      });
    });
  
  });