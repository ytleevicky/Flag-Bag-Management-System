/* eslint-disable eqeqeq */
/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {
  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  sails.bcrypt = require('bcryptjs');
  const saltRounds = 10;

  if ((await User.count()) == 0) {

    const hash = await sails.bcrypt.hash('123456', saltRounds);

    await User.createEach([
      { username: 'admin1', password: hash, role: 'admin', mail: '123@gmail.com', createdby: 'Temp' },
      { username: 'admin2', password: hash, role: 'admin', mail: 'loveyou@bu.com', createdby: 'Temp' },
      { username: 'station1', password: hash, role: 'stationmgr', mail: 'aarr@gmail.com', createdby: 'Temp' }
      // etc.
    ]);
  }

  if (await Web.count() == 0) {

    await Web.createEach([
      {
        numOfV: '60', numOfBag: '45', numOfBagBackUp: '5', eventName: 'First Event', dateOfEvent: '20-6-2020',
        eventLocation: '全港', numOfStation: '8', numOfEBag: '50'
      },
      {
        numOfV: '87', numOfBag: '55', numOfBagBackUp: '6', eventName: 'Second Event', dateOfEvent: '20-7-2020',
        eventLocation: '港島', numOfStation: '9', numOfEBag: '61'
      },
      {
        numOfV: '69', numOfBag: '60', numOfBagBackUp: '7', eventName: 'Third Event', dateOfEvent: '20-8-2020',
        eventLocation: '九龍', numOfStation: '9', numOfEBag: '67'
      },

      {
        numOfV: '50', numOfBag: '40', numOfBagBackUp: '8', eventName: 'Fourth Event', dateOfEvent: '20-9-2020',
        eventLocation: '新界', numOfStation: '7', numOfEBag: '48'
      },
    ]);

  }

  if (await Station.count() == 0) {

    await Station.createEach([
      {
        codePrinted: 'true', codePrintedTime: '18-6-2020 13:35', numOfSuser: '15', numOfSpareBag: '5', isDeleted: 'false',
        vName: 'Jean', vGroupName: 'Individual', vContact: '12345678', sName: 'TKO-S1' , sLocation: 'Po Lam Road', bagNumber: 'FFRE-1233', bagStatus: 'not collected',
        bagUpdate: '18-6-2020 13:35'
      },

      {
        codePrinted: 'true', codePrintedTime: '18-6-2020 13:35', numOfSuser: '15', numOfSpareBag: '5', isDeleted: 'false',
        vName: 'Kenny', vGroupName: 'HKBU', vContact: '12345679', sName: 'TKO-S2' , sLocation: 'Po Lam Road', bagNumber: 'FFRE-1233', bagStatus: 'not collected',
        bagUpdate: '18-6-2020'
      },
    ]);

  }

  return;
};
