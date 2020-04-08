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
        sName: 'TSW-S1', sLocation: '天水圍', createdby: 'admin1',
      },

      {
        sName: 'KLT-S1', sLocation: '九龍堂', createdby: 'admin1',
      },

      {
        sName: 'TKO-S1', sLocation: '將軍澳', createdby: 'admin1',
      },

    ]);

  }

  // if (await Volunteer.count() == 0) {

  //   await Volunteer.createEach([

  //     {
  //       vName: 'Mr Tang PK', vGroupName: 'HKBU', vGroupAddress: 'Hong Kong Baptist Road', vType: 'group', vContact: '94328888', isContacter: 'true' 
  //     },

  //     {
  //       vName: 'Ms Hailey Wood', vGroupName: 'HKUST', vGroupAddress: 'UST 1311 Road, TKO', vType: 'group', vContact: '66239964', isContacter: 'true' 
  //     },

  //     {
  //       vName: 'Leo Cruz', vGroupName: '', vType: 'individual', vGroupAddress: '', vContact: '51114553', isContacter: 'false' 
  //     },


  //   ]);

  // }


  // //Add association between volunteer && event 
  // const vol = await Volunteer.findOne({ vGroupName: 'HKBU' });
  // const event7 = await Web.findOne({ eventName: '齊抗武漢肺炎賣旗活動' });
  // await Volunteer.addToCollection(vol.id, 'in').members(event7.id);

  // const vol2 = await Volunteer.findOne({ vGroupName: 'HKUST' });
  // const event8 = await Web.findOne({ eventName: '齊抗武漢肺炎賣旗活動' });
  // await Volunteer.addToCollection(vol2.id, 'in').members(event8.id);

  // const vol3 = await Volunteer.findOne({ vName: 'Leo Cruz' });
  // const event9 = await Web.findOne({ eventName: '齊抗武漢肺炎賣旗活動' });
  // await Volunteer.addToCollection(vol3.id, 'in').members(event9.id);


  // // Add association between station && event
  // const s = await Station.findOne({ sName: 'TSW-S1' });
  // const e = await Web.findOne({ eventName: '齊抗武漢肺炎賣旗活動' });
  // await Station.addToCollection(s.id, 'inside').members(e.id);

  // const s2 = await Station.findOne({ sName: 'KLT-S1' });
  // const e2 = await Web.findOne({ eventName: '齊抗武漢肺炎賣旗活動' });
  // await Station.addToCollection(s2.id, 'inside').members(e2.id);

  // const s3 = await Station.findOne({ sName: 'TKO-S1' });
  // const e3 = await Web.findOne({ eventName: '齊抗武漢肺炎賣旗活動' });
  // await Station.addToCollection(s3.id, 'inside').members(e3.id);


  // // Add association between station && stationmgr 
  // const a = await Station.findOne({ sName: 'TSW-S1' });
  // const u1 = await User.findOne({ username: 'stationmgr1' });
  // await Station.addToCollection(a.id, 'monitorBy').members(u1.id);

  // const b = await Station.findOne({ sName: 'KLT-S1' });
  // const u2 = await User.findOne({ username: 'stationmgr2' });
  // await Station.addToCollection(b.id, 'monitorBy').members(u2.id);

  // const c = await Station.findOne({ sName: 'TKO-S1' });
  // const u3 = await User.findOne({ username: 'stationmgr3' });
  // await Station.addToCollection(c.id, 'monitorBy').members(u3.id);


  // // Add association between (group) volunteer && station 
  // const y = await Volunteer.findOne({ vGroupName: 'HKBU' });
  // const x = await Station.findOne({ sName: 'KLT-S1' });
  // await Volunteer.addToCollection(y.id, 'within').members(x.id);

  // const y2 = await Volunteer.findOne({ vGroupName: 'HKUST' });
  // const x2 = await Station.findOne({ sName: 'TKO-S1' });
  // await Volunteer.addToCollection(y2.id, 'within').members(x2.id);


  // // Add association between (individual) volunteer && station
  // const iName = await Volunteer.findOne({ vName: 'Leo Cruz' });
  // const sta2 = await Station.findOne({ sName: 'TKO-S1' });
  // await Volunteer.addToCollection(iName.id, 'within').members(sta2.id);



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



  return;
};
