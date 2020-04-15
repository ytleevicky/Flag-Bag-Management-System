//  Test the initial data inserted in config/bootstrap.js
describe('Station (model) initial data', () => {

  describe('Station TSW-S1', () => {
    it('should find Station with sName "TSW-S1"', (done) => {
      Station.find({ sName: 'TSW-S1' })
                .then((events) => {

                  if (events.length == 0) {
                    return done(new Error(
                            'Should return 1 event with eventName -- 齊抗武漢肺炎賣旗活動 ' +
                            'But instead, got: no event found'
                    ));
                  }
                  return done();
                })
                .catch(done);
    });
  });

  describe('Station KLT-S1', () => {
    it('should find Station with sName "KLT-S1"', (done) => {
      Station.find({ sName: 'KLT-S1' }).then((events) => {

        if (events.length == 0) {
          return done(new Error(
                        'Should return 1 event with eventName -- 賣得旗所 ' +
                        'But instead, got: no event found'
          ));
        }
        return done();
      })
                .catch(done);
    });
  });

});
