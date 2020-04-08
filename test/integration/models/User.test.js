//  Test the initial data inserted in config/bootstrap.js
describe('User (model) initial data', function () {

    describe('Admin user', function () {
        it('should find User with username "admin1"', function (done) {
            User.find({ username: 'admin1' })
                .then(function (users) {

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

    describe('Admin user', function () {
        it('should find User with username "admin2"', function (done) {
            User.find({ username: 'admin2' })
                .then(function (users) {

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

    describe('Stationmgr user', function () {
        it('should find User with username "stationmgr1"', function (done) {
            User.find({ username: 'stationmgr1' })
                .then(function (users) {

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

    describe('Stationmgr user', function () {
        it('should find User with username "stationmgr2"', function (done) {
            User.find({ username: 'stationmgr2' })
                .then(function (users) {

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

    describe('Stationmgr user', function () {
        it('should find User with username "stationmgr3"', function (done) {
            User.find({ username: 'stationmgr3' })
                .then(function (users) {

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