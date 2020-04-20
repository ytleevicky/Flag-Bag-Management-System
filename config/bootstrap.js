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
  // process.env.TZ = 'UTC / 00:00' ;
  sails.bcrypt = require('bcryptjs');
  const saltRounds = 10;

  // if(await User.count() > 0 || await Web.count() > 0 || Station.count() > 0){
  //   return done();
  // }

  if ((await User.count()) == 0) {

    const hash = await sails.bcrypt.hash('123456', saltRounds);

    await User.createEach([
      { username: 'admin1', password: hash, role: 'admin', mail: '123@gmail.com', createdby: 'Developer', isSelected: false },
      { username: 'admin2', password: hash, role: 'admin', mail: 'loveyou@bu.com', createdby: 'Developer', isSelected: false },
      { username: 'stationmgr1', password: hash, role: 'stationmgr', mail: 'mgr1@gmail.com', createdby: 'admin1', isSelected: true },
      { username: 'stationmgr2', password: hash, role: 'stationmgr', mail: 'mgr2@gmail.com', createdby: 'admin2', isSelected: true },
      { username: 'stationmgr3', password: hash, role: 'stationmgr', mail: 'mgr3@gmail.com', createdby: 'admin1', isSelected: true },
      // etc.
    ]);
  }

  if (await Web.count() == 0) {

    await Web.createEach([
      {
        eventName: '齊抗武漢肺炎賣旗活動', dateOfEvent: '2020-06-20',
        eventLocation: '全港'
      },
      {
        eventName: '賣得旗所', dateOfEvent: '2020-08-01',
        eventLocation: '港島'
      },

    ]);

  }

  if (await Station.count() == 0) {

    await Station.createEach([

      {
        sName: 'TSW-S1', numOfSpareBag: 2, sLocation: '天水圍', createdby: 'admin1',
      },

      {
        sName: 'KLT-S1', numOfSpareBag: 1, sLocation: '九龍堂', createdby: 'admin1',
      },

    ]);

  }

  if (await Flagbag.count() == 0) {

    await Flagbag.createEach([

      {
        isSpareBag: true, isDeleted: false, bagNumber: '001234', bagStatus: '未派發', isCodePrinted: false,
      },

      {
        isSpareBag: true, isDeleted: false, bagNumber: '002345', bagStatus: '未派發', isCodePrinted: false,
      },

      {
        isSpareBag: true, isDeleted: false, bagNumber: '009999', bagStatus: '未派發', isCodePrinted: false,
      },
      {
        isSpareBag: false, isDeleted: false, bagNumber: '-', bagStatus: '未派發', isCodePrinted: false,
      },
      {
        isSpareBag: false, isDeleted: false, bagNumber: '--', bagStatus: '未派發', isCodePrinted: false,
      },
      {
        isSpareBag: false, isDeleted: false, bagNumber: '---', bagStatus: '未派發', isCodePrinted: false,
      },



    ]);

  }

  if (await Volunteer.count() == 0) {

    await Volunteer.createEach([

      // {
      //   vContacter: 'Nick', vGroupName: 'HKBU CS Department', vGroupAddress: 'Kowloon Tong Road', vType: 'group',
      //   vContact: '98728888', isContacter: true,
      //    totalGroupNumber: 5
      // },
      // {
      //   vContacter: 'Jonas Wong', vGroupName: 'HKUST BBA Department', vGroupAddress: 'Sai Kung Road', vType: 'group',
      //   vContact: '95552733', isContacter: true, totalGroupNumber: 3
      // },
      {
        vName: 'Jimmy Chu', vGroupName: '', vGroupAddress: '', vType: 'individual',
        vContact: '95587644', isContacter: false
      },
      {
        vName: 'Silvia', vGroupName: '', vGroupAddress: '', vType: 'individual',
        vContact: '66234688', isContacter: false
      },
      {
        vName: 'Isaac', vGroupName: '', vGroupAddress: '', vType: 'individual',
        vContact: '64302848', isContacter: false
      }


    ]);

  }

  // Bootstrap data for the First Event '齊抗武漢肺炎賣旗活動'
  const e = await Web.findOne({ eventName: '齊抗武漢肺炎賣旗活動' });
  const user = await User.findOne({ username: 'stationmgr1' });
  const user2 = await User.findOne({ username: 'stationmgr2' });
  const user3 = await User.findOne({ username: 'stationmgr3' });

  const s1 = await Station.findOne({ sName: 'TSW-S1' });
  const s2 = await Station.findOne({ sName: 'KLT-S1' });

  const f1 = await Flagbag.findOne({ bagNumber: '001234' });    // spareBag
  const f2 = await Flagbag.findOne({ bagNumber: '002345' });    // spareBag
  const f3 = await Flagbag.findOne({ bagNumber: '009999' });    // spareBag
  const f4 = await Flagbag.findOne({ bagNumber: '-' });         // not assigned yet
  const f5 = await Flagbag.findOne({ bagNumber: '--' });        // not assigned yet
  const f6 = await Flagbag.findOne({ bagNumber: '---' });       // not assigned yet

  const vg1 = await Volunteer.findOne({ vContacter: 'Nick' });       // group
  const vg2 = await Volunteer.findOne({ vContacter: 'Jonas Wong' }); // group
  const vi1 = await Volunteer.findOne({ vName: 'Jimmy Chu' });  // vol
  const vi2 = await Volunteer.findOne({ vName: 'Silvia' });     // vol
  const vi3 = await Volunteer.findOne({ vName: 'Isaac' });      // vol

  await Web.addToCollection(e.id, 'superviseBy').members(user.id);
  await Web.addToCollection(e.id, 'superviseBy').members(user2.id);
  await Web.addToCollection(e.id, 'superviseBy').members(user3.id);
  await Web.addToCollection(e.id, 'include').members(s1.id);
  await Web.addToCollection(e.id, 'include').members(s2.id);
  await Station.addToCollection(s1.id, 'stationHas').members(f1.id);
  await Station.addToCollection(s1.id, 'stationHas').members(f2.id);
  await Station.addToCollection(s2.id, 'stationHas').members(f3.id);
  await Web.addToCollection(e.id, 'comprise').members(f1.id);
  await Web.addToCollection(e.id, 'comprise').members(f2.id);
  await Web.addToCollection(e.id, 'comprise').members(f3.id);
  await Station.addToCollection(s1.id, 'monitorBy').members(user.id);
  await Station.addToCollection(s1.id, 'monitorBy').members(user2.id);
  await Station.addToCollection(s2.id, 'monitorBy').members(user3.id);
  await Web.addToCollection(e.id, 'contain').members(vg1.id);
  await Web.addToCollection(e.id, 'contain').members(vg2.id);
  await Web.addToCollection(e.id, 'contain').members(vi1.id);
  await Web.addToCollection(e.id, 'contain').members(vi2.id);
  await Web.addToCollection(e.id, 'contain').members(vi3.id);
  await Volunteer.addToCollection(vg1.id, 'within').members(s1.id);
  await Volunteer.addToCollection(vg2.id, 'within').members(s2.id);
  await Volunteer.addToCollection(vi1.id, 'within').members(s1.id);
  await Volunteer.addToCollection(vi2.id, 'within').members(s1.id);
  await Volunteer.addToCollection(vi3.id, 'within').members(s2.id);
  await Volunteer.addToCollection(vi1.id, 'assignTo').members(f4.id);
  await Volunteer.addToCollection(vi2.id, 'assignTo').members(f5.id);
  await Volunteer.addToCollection(vi3.id, 'assignTo').members(f6.id);
  await Web.addToCollection(e.id, 'comprise').members(f4.id);
  await Web.addToCollection(e.id, 'comprise').members(f5.id);
  await Web.addToCollection(e.id, 'comprise').members(f6.id);


  return;
};
