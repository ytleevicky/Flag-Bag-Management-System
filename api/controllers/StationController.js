/**
 * StationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  //need to add sum of station bag function
  //for station.ejs
  station: async function (req, res) {

    var models = await Station.find();
    return res.view('station/station', { stations: models });

  },
  //for stationmgrDisplay.ejs
  stationmgrDisplay: async function (req, res) {

    var models = await User.find({
      role: 'stationmgr'
    });

    return res.view('station/stationmgrDisplay', { user: models });

  },


};

