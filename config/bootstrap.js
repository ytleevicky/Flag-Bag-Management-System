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

module.exports.bootstrap = async function() {
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
      { username: 'admin1', password: hash, role: 'admin', mail:'123@gmail.com', createdby: 'Temp' },
      { username: 'admin2', password: hash, role: 'admin', mail:'loveyou@bu.com', createdby: 'Temp' },
      { username: 'station1', password: hash, role: 'stationmgr', mail:'123@gmail.com', createdby: 'Temp' }
      // etc.
    ]);
  }

  // if (await Web.count() == 0) {

  //   await Web.createEach([
  //     {}
  //   ]);

  // }

  return;
};
