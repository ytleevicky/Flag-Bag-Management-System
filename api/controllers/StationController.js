/* eslint-disable eqeqeq */
/**
 * StationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  //manage station information(for stationmanagement.ejs)
  stationmanagement: async function (req, res) {

    var web = await User.findOne(req.session.userid).populate('edit').populate('monitor');

    if (web.monitor.length == 0) {
      return res.status(401).send('登入失敗！此旗長尚未分配到任何旗站');
    }

    var station = await Web.findOne(web.edit[0].id).populate('include', { where: { id: web.monitor[0].id } });

    req.session.stationid = station.include[0].id;

    var volunteers = await Station.findOne(station.include[0].id).populate('has', { where: { isContacter: false } });

    var bag = await Volunteer.find(volunteers.has.map(v => v.id)).populate('assignTo');

    // console.log(bag.length);  // Total num of flag bag in this station

    // console.log(station.include[0].numOfSpareBag);  // Total num of spare bag in this station

    return res.view('station/stationmanagement', { totalBag: bag.length, spareBag: station.include[0].numOfSpareBag, date: web.edit[0].dateOfEvent, stationName: station.include[0].sName, stationid: station.include[0].id });
  },

  viewAllBags: async function (req, res) {

    var volunteers = await Station.findOne(req.params.id).populate('has', { where: { isContacter: false } });

    var models = await Volunteer.find(volunteers.has.map(v => v.id)).populate('within').populate('assignTo');

    var station = await Station.findOne(req.params.id);

    var event = await Station.findOne(req.params.id).populate('inside');

    return res.view('station/viewAllBags', { stations: models, date: event.inside[0].dateOfEvent, stationName: station.sName });
  },

  collectBag: async function (req, res) {

    if (req.method == 'GET') {
      return res.view('station/collectBag');
    }

    var scannedData = req.body.qrcode;

    var event = await Station.findOne(req.session.stationid).populate('inside');

    await Web.findOne(event.inside[0].id).populate('comprise');

    var thisBag = await Flagbag.findOne({ where: { bagNumber: scannedData } });

    // Modified the flagbag status
    await Flagbag.update(thisBag.id).set({
      bagStatus: '已收'
    }).fetch();

    return res.redirect('/printRecipt/' + scannedData );
  },

  printRecipt: async function (req, res) {

    var scannedData = req.params.id;

    var event = await Station.findOne(req.session.stationid).populate('inside');

    return res.view('station/printRecipt', { bagNumber: scannedData, date: event.inside[0].dateOfEvent  });

  },

  distributeBag: async function (req, res) {

    var models = await Web.find();
    return res.view('station/distributeBag', { webs: models });

  },

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

    var models = await Web.findOne(req.session.eventid).populate('include').populate('contain', { where: { isContacter: 'false' } });

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var volunteers = await Volunteer.find(models.contain.map(w => w.id)).populate('within').populate('assignTo');

    var ws = XLSX.utils.json_to_sheet(volunteers.map(model => {

      return {
        vName: model.vName,
        vContact: model.vContact,
        sName: model.within[0].sName,
        bagNumber: model.assignTo[0].bagNumber,
        bagStatus: model.assignTo[0].bagStatus,
      };

    }));
    XLSX.utils.book_append_sheet(wb, ws, 'vIndividual_List');

    res.set('Content-disposition', 'attachment; filename=vIndividual_List.xlsx');
    return res.end(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  },

  //export group information(for group.ejs)
  export_group: async function (req, res) {

    var models = await Web.findOne(req.session.eventid).populate('include').populate('contain', { where: { vType: 'group', isContacter: 'true' } });

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var volunteers = await Volunteer.find(models.contain.map(w => w.id)).populate('within');


    var ws = XLSX.utils.json_to_sheet(volunteers.map(model => {

      return {
        vGroupName: model.vGroupName,
        vGroupAddress: model.vGroupAddress,
        vName: model.vName,
        vContact: model.vContact,
        sName: model.within[0].sName,
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

  populate_sf: async function (req, res) {

    var model = await Station.findOne(req.params.id).populate('stationHas');

    if (!model) { return res.notFound(); }

    return res.json(model);

  },

};

