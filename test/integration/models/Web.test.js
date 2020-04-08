//  Test the initial data inserted in config/bootstrap.js
describe('Web (model) initial data', function () {

    describe('First Event', function () {
        it('should find Event with eventName "齊抗武漢肺炎賣旗活動"', function (done) {
            Web.find({ eventName: '齊抗武漢肺炎賣旗活動' })
                .then(function (events) {

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

    describe('Second Event', function () {
        it('should find Event with eventName "賣得旗所"', function (done) {
            Web.find({ eventName: '賣得旗所' })
                .then(function (events) {

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