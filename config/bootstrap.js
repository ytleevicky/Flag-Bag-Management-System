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

  // if(await User.count() > 0 || await Web.count() > 0 || Station.count() > 0){
  //   return done();
  // }

  if ((await User.count()) == 0) {

    const hash = await sails.bcrypt.hash('123456', saltRounds);

    await User.createEach([
      { username: 'admin1', password: hash, role: 'admin', mail: '123@gmail.com', createdby: 'Developer' },
      { username: 'admin2', password: hash, role: 'admin', mail: 'loveyou@bu.com', createdby: 'Developer' },
      { username: 'station1', password: hash, role: 'stationmgr', mail: 'aarr@gmail.com', createdby: 'Developer' },
      { username: 'eventUser2', password: hash, role: 'stationmgr', mail: 'good@gmail.com', createdby: 'Developer' },
      { username: 'eventUser3', password: hash, role: 'stationmgr', mail: 'bad@gmail.com', createdby: 'Developer' },
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
        vName: 'Jean', vContacterName: 'Jean', vGroupName: 'Individual', vContact: '12345678', sName: 'TKO-S1', sLocation: 'Po Lam Road', bagNumber: 'FFRE-1233', bagStatus: 'not collected',
        bagUpdate: '18-6-2020 13:35'
      },

      {
        codePrinted: 'true', codePrintedTime: '18-6-2020 13:35', numOfSuser: '15', numOfSpareBag: '5', isDeleted: 'false',
        vName: 'Kenny', vContacterName: 'Jean', vGroupName: 'HKBU', vContact: '12345679', sName: 'TKO-S2', sLocation: 'PoRoad', bagNumber: 'FFRE-1233', bagStatus: 'not collected',
        bagUpdate: '18-6-2020'
      },
    ]);

  }


  // Adding association between event & eventUser
  const user = await User.findOne({ username: 'station1' });
  const event = await Web.findOne({ eventName: 'First Event' });
  await User.addToCollection(user.id, 'edit').members(event.id);

  const user2 = await User.findOne({ username: 'eventUser2' });
  const event2 = await Web.findOne({ eventName: 'Second Event' });
  await User.addToCollection(user2.id, 'edit').members(event2.id);

  const user3 = await User.findOne({ username: 'eventUser3' });
  const event3 = await Web.findOne({ eventName: 'Third Event' });
  await User.addToCollection(user3.id, 'edit').members(event3.id);



  // const n1 = await Web.findOne({eventName: "First Event"});
  // const s1 = await Station.findOne({sLocation: "Po Lam Road"});
  // await Web.addToCollection(n1.id,'include').members(s1.id);

  return;
};
