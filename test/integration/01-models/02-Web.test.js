//  Test the initial data inserted in config/bootstrap.js
describe('Web (model) initial data', () => {

  describe('First Event', () => {
    it('should find Event with eventName "齊抗武漢肺炎賣旗活動"', (done) => {
      Web.find({ eventName: '齊抗武漢肺炎賣旗活動' })
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

  describe('Second Event', () => {
    it('should find Event with eventName "賣得旗所"', (done) => {
      Web.find({ eventName: '賣得旗所' })
                .then((events) => {

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
