/* eslint-disable eqeqeq */
/**
 * StationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  //need to add sum of station bag function
  //for station.ejs


  //export event data into excel file(.xlsx format)(for station.ejs)
  export_station: async function (req, res) {

    //var models = await Station.find();

    var station = await Web.findOne(req.session.eventid).populate('include');

    var models = station.include;

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(models.map(model => {
      return {
        sName: model.sName, //旗站位置
        sLocation: model.sLocation, //賣旗地區
        //bagNumber: model.numOfBag, //旗袋總數(need to add function)
        numOfSpareBag: model.numOfSpareBag, //後備旗袋
        createdby: model.createdby
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

      models.forEach(async m => {
        await Station.addToCollection(m.id, 'inside').members(req.session.eventid); // add station to the event
      });

      if (models.length == 0) {
        return res.badRequest('No data imported.');
      }

      return res.redirect('/station/' + req.session.eventid);

    });
  },

  // //for stationmgrDisplay.ejs
  // stationmgrDisplay: async function (req, res) {

  //   // var models = await User.find(req.session.eventid, {
  //   //   role: 'stationmgr'
  //   // });

  //   var models = await User.findOne(req.session.userid).populate("superviseBy");

  //   var model = await Web.findOne(req.params.id);
  //   if(!model) return res.notFound();

  //   sails.log('[req.session.id in stationmgrDisplay] ', req.session.eventid);

  //   var sModel = await Station.find();

  //   return res.view('station/stationmgrDisplay', { user: models, webs: model, stations: sModel, eventid: req.session.eventid });

  // },

  //export station manager information(for stationmgrDisplay.ejs)
  export_statman: async function (req, res) {

    // var models = await User.find({ role: 'stationmgr' });

    var stationmgr = await Web.findOne(req.session.eventid).populate('superviseBy', { where: { role: 'stationmgr' } });

    var models = stationmgr.superviseBy;

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(models.map(model => {
      return {
        username: model.username,
        role: model.role,
        mail: model.mail,
        // flagstn: model.flagstn,
        // password: model.password,
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
        sName: model.sName,
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

  //upload individual volunteer information
  import_vIndividual: async function (req, res) {

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

      return res.redirect('/individual');

    });
  },


  //manage station information(for stationmanagement.ejs)
  stationmanagement: async function (req, res) {

    var models = await Web.find();
    return res.view('station/stationmanagement', { webs: models });

  },


  addIndividual: async function (req, res) {

    if (req.method == 'GET') {

      var groupList = await Web.findOne(req.session.eventid).populate('include', { where: { vContacterName: { '!=': '' } } || { vGroupName: { '!=': ''  }} });

      var stationList = await Web.findOne(req.session.eventid).populate('include' , { where: {numOfSpareBag: {'!=': 0 } }});

      // var models = await Station.find();
      var web = await Web.findOne(req.session.eventid);

      return res.view('station/addIndividual', { eventid: req.session.eventid, name: web.eventName, groups: groupList.include, stations: stationList.include });

    }

    var individual = await Station.create(req.body.Station).fetch();

    await Station.addToCollection(individual.id, 'inside').members(req.session.eventid);

    return res.redirect('/individual/' + req.session.eventid);

  },


  viewIndividual: async function (req, res) {
    var event = await Web.findOne(parseInt(req.session.eventid));

    var models = await Station.findOne(req.params.id);
    if (!models) {return res.notFound();}
    console.log(models);

    var s = await Web.findOne(req.session.eventid).populate('include', {sName: models.sName});
    if (!s) { return res.notFound(); }

    var model = await Station.find();

    return res.view('station/viewIndividual', { name: model.eventName, stations: models, eventid: event.id, eventname: event.eventName, go: s.include});

  },

  //export group information(for group.ejs)
  export_group: async function (req, res) {

    var models = await Station.find();

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(models.map(model => {
      return {
        vGroupName: model.vGroupName,
        vName: model.vName,
        vContact: model.vContact,
        sName: model.sName,
      };
    }));
    XLSX.utils.book_append_sheet(wb, ws, 'vGroup_List');

    res.set('Content-disposition', 'attachment; filename=vGroup_List.xlsx');
    return res.end(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  },

  //upload group information
  import_group: async function (req, res) {

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

      return res.redirect('/group');

    });
  },

  //action - populate(for station and web)
  populate_sw: async function (req, res) {

    var model = await Station.findOne(req.params.id).populate('inside');

    if (!model) { return res.notFound(); }

    return res.json(model);

  },
  //action - populate(for station and user)
  populate_su: async function (req, res) {

    var model = await Station.findOne(req.params.id).populate('monitorBy');

    if (!model) { return res.notFound(); }

    return res.json(model);

  },

  populate_sv: async function (req, res) {

    var model = await Station.findOne(req.params.id).populate('has');

    if (!model) { return res.notFound(); }

    return res.json(model);

  },

};

