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
      { username: 'stationmgr1', password: hash, role: 'stationmgr', mail: 'mgr1@gmail.com', createdby: 'admin1' },
      { username: 'stationmgr2', password: hash, role: 'stationmgr', mail: 'mgr2@gmail.com', createdby: 'admin2' },
      { username: 'stationmgr3', password: hash, role: 'stationmgr', mail: 'mgr3@gmail.com', createdby: 'admin1' },
      // etc.
    ]);
  }

  if (await Web.count() == 0) {

    await Web.createEach([
      {
        numOfV: '60', numOfBag: '45', numOfBagBackUp: '5', eventName: '齊抗武漢肺炎賣旗活動', dateOfEvent: '20-06-2020',
        eventLocation: '全港', numOfStation: '8', numOfEBag: '50'
      },
      {
        numOfV: '87', numOfBag: '55', numOfBagBackUp: '6', eventName: '賣得旗所', dateOfEvent: '01-08-2020',
        eventLocation: '港島', numOfStation: '9', numOfEBag: '61'
      },
      {
        numOfV: '69', numOfBag: '60', numOfBagBackUp: '7', eventName: '結伴賣旗日', dateOfEvent: '17-09-2020',
        eventLocation: '九龍', numOfStation: '9', numOfEBag: '67'
      },
    ]);

  }

  if (await Station.count() == 0) {

    await Station.createEach([

      {
        codePrinted: 'false', codePrintedTime: '18-6-2020 13:35', numOfSuser: '15', numOfSpareBag: '5', isDeleted: 'false',
        vName: 'Leung Wing Yan', vContacterName: '',  vGroupAddress: '', vGroupName: '個人', vContact: '95473162', sName: 'TSW-S1', sLocation: '天水圍', bagNumber: 'FFRE-1233', bagStatus: 'not collected',
        bagUpdate: '18-6-2020 13:35', createdby: 'admin1'
      },

      {
        codePrinted: 'false', codePrintedTime: '18-6-2020 13:35', numOfSuser: '15', numOfSpareBag: '5', isDeleted: 'false',
        vName: 'Lo Hoi Wing Jill', vContacterName: 'Chan Sum Yi',  vGroupAddress: '新界天水圍天晴邨天晴服務設施大樓地下1號', vGroupName: '平安福音堂幼稚園(天水圍)', vContact: '99781354', sName: 'TSW-S2', sLocation: '天水圍', bagNumber: 'FFRE-1233', bagStatus: 'not collected',
        bagUpdate: '18-6-2020 13:35', createdby: 'admin1'
      },

      {
        codePrinted: 'false', codePrintedTime: '18-6-2020 13:35', numOfSuser: '15', numOfSpareBag: '5', isDeleted: 'false',
        vName: 'Wong Ming Ho Leon', vContacterName: 'Chris Chan KY', vGroupAddress: '九龍塘蘭開夏道2號', vGroupName: '九龍塘宣道小學', vContact: '96843135', sName: 'KLT-S1', sLocation: '九龍塘', bagNumber: 'FFRE-1233', bagStatus: 'not collected',
        bagUpdate: '18-6-2020 11:00', createdby: 'admin2'
      },
    ]);

  }


  // Adding association between event & eventUser
  const user = await User.findOne({ username: 'stationmgr1' });
  const event = await Web.findOne({ eventName: '齊抗武漢肺炎賣旗活動' });
  await User.addToCollection(user.id, 'edit').members(event.id);

  const user2 = await User.findOne({ username: 'stationmgr2' });
  const event2 = await Web.findOne({ eventName: '齊抗武漢肺炎賣旗活動' });
  await User.addToCollection(user2.id, 'edit').members(event2.id);

  const user3 = await User.findOne({ username: 'stationmgr3' });
  const event3 = await Web.findOne({ eventName: '齊抗武漢肺炎賣旗活動' });
  await User.addToCollection(user3.id, 'edit').members(event3.id);

  // Adding association between event && Station(Group)
  // const group = await Station.findOne({ vGroupName: 'Individual' });
  // await Station.addToCollection(group.id, 'inside').members(event.id);

  // const group2 = await Station.findOne({ vGroupName: 'HKBU' });
  // await Station.addToCollection(group2.id, 'inside').members(event2.id);

  // const n1 = await Web.findOne({eventName: "First Event"});
  // const s1 = await Station.findOne({sLocation: "Po Lam Road"});
  // await Web.addToCollection(n1.id,'include').members(s1.id);

  return;
};
