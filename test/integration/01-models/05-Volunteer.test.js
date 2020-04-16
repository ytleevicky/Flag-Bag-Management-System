describe('Volunteer (model) initial data', () => {

  describe('Volunteer Name: Jonas Wong', () => {
    it('should find Volunteer Name with vName Jonas Wong ', (done) => {
      Volunteer.find({ vName: 'Jonas Wong'})
                        .then((events) => {

                          if (events.length == 0) {
                            return done(new Error(
                                    'Should return 1 vName with vName -- Jonas Wong ' +
                                    'But instead, got: no vName found'
                            ));
                          }
                          return done();
                        })
                        .catch(done);
    });
  });

  describe('Volunteer Name: Nick, Group Name: HKBU CS Department', () => {
    it('should find Volunteer Name with vName Nick and vGroupName HKBU CS Department', (done) => {
      Volunteer.find({ vName: 'Nick', vGroupName: 'HKBU CS Department'})
                    .then((events) => {

                      if (events.length == 0) {
                        return done(new Error(
                                'Should return 1 vName with vName -- Nick ' +
                                'But instead, got: no vName found'
                        ));
                      }
                      return done();
                    })
                    .catch(done);
    });
  });

  describe('Group Name: HKBU CS Department', () => {
    it('should find Group Name with vGroupName HKBU CS Department ', (done) => {
      Volunteer.find({ vGroupName: 'HKBU CS Department'})
                        .then((events) => {

                          if (events.length == 0) {
                            return done(new Error(
                                    'Should return vaild operation since there is vGroupName: HKBU CS Department found ' +
                                    'But instead, got: no vGroupName found'
                            ));
                          }
                          return done();
                        })
                        .catch(done);
    });
  });

  describe('Group Name: HKUST BBA Department and Group Address: Sai Kung Road', () => {
    it('should find Group Name with vGroupName HKUST BBA Department and Group Address with vGroupAddress Sai Kung Road', (done) => {
      Volunteer.find({ vGroupName: 'HKUST BBA Department', vGroupAddress: 'Sai Kung Road'})
                        .then((events) => {

                          if (events.length == 0) {
                            return done(new Error(
                                    'Should return vaild operation since there is vGroupName: HKUST BBA Department with vGroupAddress: Sai Kung Road found ' +
                                    'But instead, got: no vaild result found'
                            ));
                          }
                          return done();
                        })
                        .catch(done);
    });
  });

  describe('Volunteer Type: Individual', () => {
    it('should find Volunteer Type with vType individual ', (done) => {
      Volunteer.find({ vType: 'individual'})
                        .then((events) => {

                          if (events.length == 0) {
                            return done(new Error(
                                'Should return vaild operation since there is vType: individual found ' +
                                'But instead, got: no vType found'
                            ));
                          }
                          return done();
                        })
                        .catch(done);
    });
  });

  describe('Volunteer Type: Group', () => {
    it('should find Volunteer Type with vType group ', (done) => {
      Volunteer.find({ vType: 'group'})
                        .then((events) => {

                          if (events.length == 0) {
                            return done(new Error(
                                'Should return vaild operation since there is vType: group found ' +
                                'But instead, got: no vType found'
                            ));
                          }
                          return done();
                        })
                        .catch(done);
    });
  });

  describe('Volunteer is Contacter: Yes', () => {
    it('should find Volunteer Contacter with isContacter true ', (done) => {
      Volunteer.find({ isContacter: true})
                        .then((events) => {

                          if (events.length == 0) {
                            return done(new Error(
                                'Should return vaild operation since there is isContacter: true found ' +
                                'But instead, got: no vaild operation found'
                            ));
                          }
                          return done();
                        })
                        .catch(done);
    });
  });

  describe('Volunteer is Contacter: No', () => {
    it('should find Volunteer Contacter with isContacter false ', (done) => {
      Volunteer.find({ isContacter: false})
                        .then((events) => {

                          if (events.length == 0) {
                            return done(new Error(
                                'Should return vaild operation since there is isContacter: false found ' +
                                'But instead, got: no vaild operation found'
                            ));
                          }
                          return done();
                        })
                        .catch(done);
    });
  });

});
