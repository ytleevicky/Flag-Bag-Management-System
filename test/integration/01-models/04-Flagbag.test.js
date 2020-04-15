/* eslint-disable eqeqeq */
//  Test the initial data inserted in config/bootstrap.js
describe('Flagbag (model) initial data', () => {

  describe('Flagbag 001234', () => {
    it('should find Flagbag with bagNumber "001234"', (done) => {
      Flagbag.find({ bagNumber: '001234' })
                .then((events) => {

                  if (events.length == 0) {
                    return done(new Error(
                            'Should return 1 flagbag with bagNumber -- 001234 ' +
                            'But instead, got: no event found'
                    ));
                  }
                  return done();
                })
                .catch(done);
    });
  });

  describe('Flagbag 002345', () => {
    it('should find Flagbag with bagNumber "002345"', (done) => {
      Flagbag.find({ bagNumber: '002345' })
                .then((events) => {

                  if (events.length == 0) {
                    return done(new Error(
                            'Should return 1 flagbag with bagNumber -- 001234 ' +
                            'But instead, got: no event found'
                    ));
                  }
                  return done();
                })
                .catch(done);
    });
  });

  describe('Flagbag isSpareBag', () => {
    it('should find Flagbag with status isSpareBag is true', (done) => {
      Flagbag.find({ isSpareBag: true })
                .then((events) => {

                  if (events.length == 0) {
                    return done(new Error(
                            'Should return vaild operation since there is isSpareBag: true found ' +
                            'But instead, got: no event found'
                    ));
                  }
                  return done();
                })
                .catch(done);
    });
  });

  describe('Flagbag isSpareBag', () => {
    it('should find Flagbag with status isSpareBag is false', (done) => {
      Flagbag.find({ isSpareBag: false })
                .then((events) => {

                  if (events.length == 0) {
                    return done(new Error(
                            'Should return vaild operation since there is isSpareBag: false found ' +
                            'But instead, got: no event found'
                    ));
                  }
                  return done();
                })
                .catch(done);
    });
  });

});
