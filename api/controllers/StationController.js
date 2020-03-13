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

    var models = await Station.find();

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(models.map(model => {
      return {
        sName: model.sName, //旗站位置
        sLocation: model.sLocation, //賣旗地區
        //bagNumber: model.numOfBag, //旗袋總數(need to add function)
        numOfSpareBag: model.numOfSpareBag, //後備旗袋
      };
    }));
    XLSX.utils.book_append_sheet(wb, ws, 'Station_List');

    res.set('Content-disposition', 'attachment; filename=Station_List.xlsx');
    return res.end(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  },

  import_station: async function (req, res) {

    req.file('file').upload({ maxBytes: 10000000 }, async function whenDone(err, uploadedFiles) {
      if (err) { return res.serverError(err); }
      if (uploadedFiles.length === 0) { return res.badRequest('No file was uploaded'); }

      var XLSX = require('xlsx');
      var workbook = XLSX.readFile(uploadedFiles[0].fd);
      var ws = workbook.Sheets[workbook.SheetNames[0]];
      var data = XLSX.utils.sheet_to_json(ws);
      console.log(data);
      var models = await Station.createEach(data).fetch();

      if (models.length == 0) {
        return res.badRequest('No data imported.');
      }

      return res.redirect('/station');
      
    });
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

   //export individual volunteer information(for individual.ejs)
   export_vIndividual: async function (req, res) {

    var models = await Station.find();

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(models.map(model => {
      return {
        vName: model.vName,
        vContact: model.vContact,
        sLocation: model.sLocation,
        bagNumber: model.bagNumber,
        bagStatus: model.bagStatus,
        bagUpdate: model.bagUpdate,
        codePrintedTime: model.codePrintedTime
      };
    }));
    XLSX.utils.book_append_sheet(wb, ws, 'vIndividual_List');

    res.set('Content-disposition', 'attachment; filename=vIndividual_List.xlsx');
    return res.end(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  },

  //manage station information(for stationmanagement.ejs)
  stationmanagement: async function (req, res) {

    var models = await Web.find();
    return res.view('station/stationmanagement', { webs: models });

  },

  individual: async function (req, res) {

    var models = await Station.find();
    return res.view('station/individual', { stations: models });

  },

};

