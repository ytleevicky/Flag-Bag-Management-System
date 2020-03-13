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

  //export event data into excel file(.xlsx format)(for station.ejs)
  export_station: async function (req, res) {

    var models = await Web.find();

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(models.map(model => {
      return {
        sName: model.sName, //旗站位置
        sLocation: model.slocation, //賣旗地區
        //bagNumber: model.numOfBag, //旗袋總數(need to add function)
        bagStats: model.numOfSpareBag, //後備旗袋
      };
    }));
    XLSX.utils.book_append_sheet(wb, ws, 'Station_List');

    res.set('Content-disposition', 'attachment; filename=Station_List.xlsx');
    return res.end(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  },

  //for stationmgrDisplay.ejs
  stationmgrDisplay: async function (req, res) {

    var models = await User.find({
      role: 'stationmgr'
    });

    return res.view('station/stationmgrDisplay', { user: models });

  },

  //export station manager information(for stationmgrDisplay.ejs)
  export_statman: async function (req, res) {

    var models = await User.find({role:'stationmgr'});

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(models.map(model => {
      return {
        username: model.username,
        role: model.role,
        mail: model.mail,
        flagstn: model.flagstn,
        password: model.password,
        createdby: model.createdby
      };
    }));
    XLSX.utils.book_append_sheet(wb, ws, 'statman_List');

    res.set('Content-disposition', 'attachment; filename=statman_List.xlsx');
    return res.end(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  },
  //manage station information(for stationmanagement.ejs)
  stationmanagement: async function (req, res) {

    var models = await Web.find();
    return res.view('web/stationmanagement', { webs: models });

  },

};

