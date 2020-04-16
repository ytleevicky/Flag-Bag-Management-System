/* eslint-disable callback-return */
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
  describe(`Policy Check: #createIndividual() without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .post('/volunteer/individual')
        .send('Volunteer[vName]=Jean Lai&Station[sName]=TSW-S1&Volunteer[vContact]=99999999&Volunteer[vType]=individual&Volunteer[isContacter]=true')
        .expect(403, done);
    });
  });

  // View Group:
  describe(`Policy Check: #viewGroup() without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .get('/group/' + volunteerID)
        .expect(403, done);
    });
  });

  // View Group:
  describe(`Policy Check: #viewIndividual() without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .get('/individual/' + volunteerID)
        .expect(403, done);
    });
  });

  // Update Group:
  describe(`Policy Check: #updateGroup() without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .get('/updateGroup/' + volunteerID)
        .expect(403, done);
    });
  });

  //Update Individual:
  describe(`Policy Check: #updateIndividual() without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .get('/updateIndividual/' + volunteerID)
        .expect(403, done);
    });
  });

  //Delete Volunteer:
  describe(`Policy Check: #removeVolunteer() without login`, () => {
    step('should return 403 Forbidden', (done) => {
      supertest(sails.hooks.http.app)
        .delete('/volunteer/' + volunteerID)
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

  // create individual Volunteer
  describe(`#createIndividual() Volunteer[vName]=Jean Lai&Station[sName]=TSW-S1&Volunteer[vContact]=99999999&Volunteer[vType]=individual&Volunteer[isContacter]=true with admin2 login`, () => {
    step('should return 200 "Successfully created!"', (done) => {
      Async.series([
        function (cb) {
          supertest(sails.hooks.http.app)
            .post('/user/login')
            .send({ username: 'admin2', password: '123456' })
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
            .post('/volunteer/individual')
            .set('Cookie', cookie)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('Volunteer[vName]=Jean Lai&Station[sName]=TSW-S1&Volunteer[vContact]=99999999&Volunteer[vType]=individual&Volunteer[isContacter]=true')
            .expect(200).then(() => {
              Volunteer.findOne({ where: { vName: 'Jean Lai' } }).then(model => {
                if (model) {
                  volunteerID = model.id;
                  return cb();
                }
                return cb(new Error('Can\'t create individual named - Jean Lai'));
              });
            });
        }
      ], done);
    });
  });

  // viewGroup (/group/:id)
  describe(`#viewStation() view all the station in this event with admin1 login`, () => {
    step('should return 200 "Successfully viewed!"', (done) => {
      Async.series([
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
            .get('/group/' + eventId)
            .set('Cookie', cookie)
            .expect(200).then(() => {
              Station.find().then(model => {
                if (model) {
                  stationID = model.id;
                  return cb();
                }
                else {
                  cb(new Error('Can\'t view any group'));
                }
              });
            });
        }
      ], done);
    });
  });

  // viewspecificGroup (/group/:id)
  describe(`#viewspecificGroup() view a specific group in this event with admin1 login`, () => {
    step('should return 200 "Successfully viewed!"', (done) => {
      Async.series([
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
          Volunteer.find({ where: { vGroupName: 'HKBU CS Department' } }).then(model => {
            if (model) {
              stationID = model.id;
            }
            cb();
          });
        },

        function (cb) {
          supertest(sails.hooks.http.app)
            .get('/group/' + eventId)
            .set('Cookie', cookie)
            .expect(200).then(() => {
              Volunteer.find({ where: { vGroupName: 'HKBU CS Department' } }).then(model => {
                if (model) {
                  stationID = model.id;
                  return cb();
                }
                else {
                  cb(new Error('Can\'t view any station'));
                }
              });
            });
        }

      ], done);
    });
  });

  // viewIndividual (/individual/:id)
  describe(`#viewStation() view all the station in this event with admin1 login`, () => {
    step('should return 200 "Successfully viewed!"', (done) => {
      Async.series([
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
          .get('/individual/' + eventId)
          .set('Cookie', cookie)
          .expect(200).then(() => {
            Station.find().then(model => {
              if (model) {
                stationID = model.id;
                return cb();
              }
              else {
                cb(new Error('Can\'t view any individual'));
              }
            });
          });
        }
      ], done);
    });
  });

  // viewspecificIndividual (/individual/:id)
  describe(`#viewspecificIndividual() view a specific individual in this event with admin1 login`, () => {
    step('should return 200 "Successfully viewed!"', (done) => {
      Async.series([
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
          Volunteer.findOne({ where: { vName: 'Isaac', vType: 'individual' } }).then(model => {
            if (model) {
              stationID = model.id;
            }
            cb();
          });
        },

        function (cb) {
          supertest(sails.hooks.http.app)
            .get('/individual/' + eventId)
            .set('Cookie', cookie)
            .expect(200).then(() => {
              Volunteer.findOne({ where: { vName: 'Isaac', vType: 'individual' } }).then(model => {
                if (model) {
                  stationID = model.id;
                  return cb();
                }
                else {
                  cb(new Error('Can\'t view any specific individuals'));
                }
              });
            });
        }

      ], done);
    });
  });

  // updateGroup
  describe(`#updateGroup() with admin1 login`, () => {
    step('should return 200 "Successfully updated!"', (done) => {
      Async.series([
        function (cb) {
          Web.findOne({ where: { eventName: '齊抗武漢肺炎賣旗活動' } }).then(model => {
            if (!model) {
              cb(new Error(` { eventName: '齊抗武漢肺炎賣旗活動' } not found`));
            }
            eventId = model.id;
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
          Volunteer.findOne({ where: { vName: 'Nick', vGroupName: 'HKBU CS Department' } }).then(model => {
            if (!model) {
              cb(new Error(` Volunteer { vName: Nick, vGroupName: HKBU CS Department } not found`));
            }
            volunteerID = model.id;
            cb();
          });
        },
        function (cb) {
          supertest(sails.hooks.http.app)
            .patch('/volunteer/group/' + volunteerID)
            .set('Cookie', cookie)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('Volunteer[vName]=Nick Hui&Volunteer[vGroupName]=HKUST BBA Department 123&Station[sLocation]=HKL')
            .expect(200).then(() => {
              Volunteer.findOne({ where: { vName: 'Nick Hui', vGroupName: 'HKUST BBA Department 123' } }).then(model => {
                if (model) {
                  volunteerID = model.id;
                  return cb();
                } else {
                  return cb(new Error('Can\'t find Nick Hui with HKUST BBA Department'));
                }
              });
            });
        }
      ], done);
    });
  });

  //UpdateIndividual
  describe(`#updateIndividual() with admin1 login`, () => {
    step('should return 200 "Successfully updated!"', (done) => {
      Async.series([
        function (cb) {
          Web.findOne({ where: { eventName: '齊抗武漢肺炎賣旗活動' } }).then(model => {
            if (!model) {
              cb(new Error(` { eventName: '齊抗武漢肺炎賣旗活動' } not found`));
            }
            eventId = model.id;
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
          Volunteer.findOne({ where: { vName: 'Isaac', vType: 'individual' } }).then(model => {
            if (!model) {
              cb(new Error(` Volunteer { vName: Isaac, vType: individual } not found`));
            }
            volunteerID = model.id;
            cb();
          });
        },
        function (cb) {
          supertest(sails.hooks.http.app)
            .patch('/volunteer/individual/' + volunteerID)
            .set('Cookie', cookie)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('Volunteer[vName]=Isaac Lam&Volunteer[vContact]=65433333&Station[sLocation]=HKL')
            .expect(200).then(() => {
              Volunteer.findOne({ where: { vName: 'Isaac Lam', vContact: '65433333' } }).then(model => {
                if (model) {
                  volunteerID = model.id;
                  return cb();
                } else {
                  return cb(new Error('Can\'t find Isaac Lam with contact 65433333'));
                }
              });
            });
        }
      ], done);
    });
  });

  // deleteIndividual
  describe(`#deleteIndividual() Volunteer[vName]=Silvia with admin1 login`, () => {
    step('should return 200 "Successfully deleted!"', (done) => {
      Async.series([
        function (cb) {
          Web.findOne({ where: { eventName: '齊抗武漢肺炎賣旗活動' } }).then(model => {
            if (!model) {
              cb(new Error(` { eventName: '齊抗武漢肺炎賣旗活動' } not found`));
            }
            eventId = model.id;
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
          Volunteer.findOne({ where: { vName: 'Silvia' } }).then(model => {
            if (!model) {
              cb(new Error(` Volunteer { vName: 'Silvia' } not found`));
            }
            volunteerID = model.id;
            cb();
          });
        },
        function (cb) {
          supertest(sails.hooks.http.app)
            .delete('/volunteer/' + volunteerID)
            .set('Cookie', cookie)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .expect(200).then(() => {
              Volunteer.findOne({ where: { vName: 'Silvia' } }).then(model => {
                if (!model) {
                  return cb();
                } else {
                  cb(new Error('Can\'t delete Silvia'));
                }
              });
            });
        }
      ], done);
    });
  });

  // deleteGroup
  describe(`#deleteGroup() Volunteer[vGroupName]=HKBU CS Department with admin1 login`, () => {
    step('should return 200 "Successfully deleted!"', (done) => {
      Async.series([
        function (cb) {
          Web.findOne({ where: { eventName: '齊抗武漢肺炎賣旗活動' } }).then(model => {
            if (!model) {
              cb(new Error(` { eventName: '齊抗武漢肺炎賣旗活動' } not found`));
            }
            eventId = model.id;
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
          Volunteer.findOne({ where: { vGroupName: 'HKUST BBA Department', isContacter: true } }).then(model => {
            if (!model) {
              cb(new Error(` Volunteer { vGroupName: 'HKUST BBA Department' } not found`));
            }
            volunteerID = model.id;
            cb();
          });
        },
        function (cb) {
          supertest(sails.hooks.http.app)
            .delete('/volunteer/' + volunteerID)
            .set('Cookie', cookie)
            .set('Accept', 'text/html,application/xhtml+xml,application/xml')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .expect(200).then(() => {
              Volunteer.findOne({ where: { vGroupName: 'HKUST BBA Department', isContacter: true } }).then(model => {
                if (!model) {
                  return cb();
                } else {
                  cb(new Error('Can\'t delete Silvia'));
                }
              });
            });
        }
      ], done);
    });
  });


});
