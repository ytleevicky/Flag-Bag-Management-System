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
        vGroupName: model.sLocation, //旗站位置
        sLocation: model.location, //賣旗地區
        bagNumber: model.numOfBag, //旗袋總數
        bagStats: model.numOfBagBackUp, //後備旗袋
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


};

