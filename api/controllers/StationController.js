/* eslint-disable eqeqeq */
/**
 * StationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var printf = require('printf');

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

    var receivedBag = 0;    // number of flag bag collected

    for (i = 0; i < bag.length; i++) {

      if (bag[i].assignTo[0].bagStatus == '已收') {
        receivedBag = receivedBag + 1;
      }

    }

    var spareBag = await Station.findOne(req.session.stationid).populate('stationHas', { where: { bagStatus: '已收' } });



    var notReceivedBag = 0;   // number of flag not yet received

    for (i = 0; i < bag.length; i++) {

      if (bag[i].assignTo[0].bagStatus == '已派發' || bag[i].assignTo[0].bagStatus == '未派發') {
        notReceivedBag = notReceivedBag + 1;
      }

    }

    return res.view('station/stationmanagement', { totalVBag: bag.length, spareBag: station.include[0].numOfSpareBag, date: web.edit[0].dateOfEvent, stationName: station.include[0].sName, stationid: station.include[0].id, VolTotalReceived: receivedBag, SpareTotalReceived: spareBag.stationHas.length, totalNotReceived: notReceivedBag, totalVol: volunteers.has.length });
  },

  viewAllBags: async function (req, res) {

    var volunteers = await Station.findOne(req.params.id).populate('has', { where: { isContacter: false } });

    var models = await Volunteer.find({
      where: { id: volunteers.has.map(v => v.id)},
      sort: 'vName'
    }).populate('within').populate('assignTo');

    var station = await Station.findOne(req.params.id);

    var event = await Station.findOne(req.params.id).populate('inside');

    return res.view('station/viewAllBags', { stations: models, date: event.inside[0].dateOfEvent, stationName: station.sName });
  },

  viewSpareBags: async function (req, res) {

    var models = await Station.findOne(req.session.stationid).populate('stationHas', { where: { isSpareBag: true } });

    var station = await Station.findOne(req.session.stationid);

    var event = await Station.findOne(req.session.stationid).populate('inside');

    return res.view('station/viewSpareBags', { stations: models.stationHas, date: event.inside[0].dateOfEvent, stationName: station.sName });

  },

  viewNotReceived: async function (req, res) {

    var volunteers = await Station.findOne(req.params.id).populate('has', { where: { isContacter: false } });

    var models = await Volunteer.find({
      where:{
      id: volunteers.has.map(v => v.id)},
      sort:'vName'}).populate('within', { where: { }}).populate('assignTo', { where: { bagStatus:  { '!=': '已收' } }});

    var sBag = await Station.findOne(req.session.stationid).populate('stationHas', { where: { isSpareBag: true, bagStatus:  { '!=': '已收' } } });

    var station = await Station.findOne(req.params.id);

    var event = await Station.findOne(req.params.id).populate('inside');

    return res.view('station/viewNotReceived', { stations: models, date: event.inside[0].dateOfEvent, stationName: station.sName, spareBag: sBag.stationHas });
  },

  printSpareQR: async function (req, res) {

    const qrcode = require('qrcode-generator');

    var station = await Station.findOne(req.params.id).populate('stationHas', { where: { isSpareBag: true, isDeleted: false } });

    for (i = 0; i < station.stationHas.length; i++) {

      let code = printf('%06d', station.stationHas[i].id);

      await Flagbag.update(station.stationHas[i].id).set({
        bagNumber: code,
        bagStatus: '已派發',
        isCodePrinted: true,
        codePrintedTime: station.stationHas[i].updatedAt,
      }).fetch();

    }

    var updatedStation = await Station.findOne(req.params.id).populate('stationHas', { where: { isSpareBag: true, isDeleted: false } });

    return res.view('station/printSpareQR', { StationSpareBag: updatedStation.stationHas, 'qrcode': qrcode, stationName: station.sName, stationLocation: station.sLocation, layout:false });

  },

  collectBag: async function (req, res) {

    if (req.method == 'GET') {
      return res.view('station/collectBag');
    }

    var scannedData = req.body.qrcode;

    var event = await Station.findOne(req.session.stationid).populate('inside');

    await Web.findOne(event.inside[0].id).populate('comprise');

    var volunteers = await Station.findOne(req.session.stationid).populate('has', { where: { isContacter: false } });

    var bag = await Volunteer.find(volunteers.has.map(v => v.id)).populate('assignTo');

    var bagInThisStation = [];

    for (i = 0; i < bag.length; i++) {
      bagInThisStation.push(bag[i].assignTo[0].bagNumber);
    }

    var spareBags = await Station.findOne(req.session.stationid).populate('stationHas', { where: { isSpareBag: true } });

    for (i = 0; i < spareBags.stationHas.length; i++) {
      bagInThisStation.push(spareBags.stationHas[i].bagNumber);
    }

    if (bagInThisStation.includes(scannedData)) {

      var web = await User.findOne(req.session.userid).populate('edit');

      var thisBag = await Web.findOne(web.edit[0].id).populate('comprise', { where: { bagNumber: scannedData } });

      // Modified the flagbag status
      await Flagbag.update(thisBag.comprise[0].id).set({
        bagStatus: '已收'
      }).fetch();

    } else {

      res.status(401);
      return res.view('alert', { message: '輸入了無效的旗袋號碼！請再次嘗試', url: '/collectBag' });
    }

    return res.redirect('/printReceipt/' + scannedData);
  },

  printReceipt: async function (req, res) {

    var scannedData = req.params.id;

    var event = await Station.findOne(req.session.stationid).populate('inside');

    return res.view('station/printReceipt', { bagNumber: scannedData, date: event.inside[0].dateOfEvent });

  },

  distributeBag: async function (req, res) {

    if (req.method == 'GET') {

      return res.view('station/distributeBag');

    }

    var scannedData = req.body.qrcode;

    var spareBags = await Station.findOne(req.session.stationid).populate('stationHas', { where: { isSpareBag: true } });

    var bagInThisStation = [];

    var count = spareBags.stationHas.length;

    for (i = 0; i < count; i++) {
      bagInThisStation.push(spareBags.stationHas[i].bagNumber);
    }

    if (bagInThisStation.includes(scannedData)) {

      var web = await User.findOne(req.session.userid).populate('edit');

      var thisBag = await Web.findOne(web.edit[0].id).populate('comprise', { where: { bagNumber: scannedData } });

      // Modified the flagbag status
      await Flagbag.update(thisBag.comprise[0].id).set({
        bagStatus: '已派發'
      }).fetch();

      res.status(200);
      return res.view('alert', { message: '成功派發旗袋', url: '/distributeBag' });

    } else {

      res.status(401);
      return res.view('alert', { message: '輸入了無效的旗袋號碼！請再次嘗試', url: '/distributeBag' });

    }

  },


  station: async function (req, res) {

    var models = await Web.findOne(req.session.eventid).populate('include', { where: { numOfSpareBag: { '!=': 0 } } });
    if (!models) { return res.notFound(); }

    var sta = await Station.find(models.include.map(s => s.id)).populate('has', { where: { isContacter: false } });

    var web = await Web.findOne(req.session.eventid);

    return res.view('station/station', { name: web.eventName, go: sta, eventid: req.session.eventid });

  },


  updateStation: async function (req, res) {

    var model = await Station.findOne(req.params.id).populate('monitorBy');
    if (req.method == 'GET') {

      var event = await Web.findOne(req.session.eventid).populate('superviseBy');

      var users = event.superviseBy.filter(u => u.role == 'stationmgr' & u.isSelected == false);

      if (!model) { return res.notFound(); }

      var web = await Web.findOne(req.session.eventid);

      return res.view('station/updateStation', { station: model, eventid: req.session.eventid, name: web.eventName, users: users });

    } else {

      if (!req.body.User || !req.body.Station) { return res.badRequest('Form-data not received.'); }

      sails.bcrypt = require('bcryptjs');
      const saltRounds = 10;

      var stationManagers = await Web.findOne(req.session.eventid).populate('superviseBy', { where: { username: { in: req.body.User.username.split(',').map(s => s.trim()) } } });

      // var stationManagers = await User.find({ username: { in: req.body.User.username.split(',').map(s => s.trim()) } });

      var models = await Station.update(req.params.id).set({
        sName: req.body.Station.sName,
        sLocation: req.body.Station.sLocation,
        numOfSpareBag: req.body.Station.numOfSpareBag,
        // username: req.body.User.username,
      }).fetch();

      if (models.length > 0) {
        if (model.monitorBy.length > 0) {

          var previousUser = await Station.findOne(req.params.id).populate('monitorBy');

          await Station.removeFromCollection(req.params.id, 'monitorBy').members(model.monitorBy.map(u => u.id));

          await User.update(previousUser.monitorBy.map(u => u.id)).set({
            isSelected: false
          }).fetch();

        }

        await Station.addToCollection(req.params.id, 'monitorBy').members(stationManagers.superviseBy.map(manager => manager.id));

        await User.update(stationManagers.superviseBy.map(u => u.id)).set({
          isSelected: true
        }).fetch();

      } else {
        return res.notFound();
      }

      // Get all the spareBag within this station
      var existingSpareBag = await Station.findOne(req.params.id).populate('stationHas', { where: { isSpareBag: true } });

      await Flagbag.update(existingSpareBag.stationHas.map(e => e.id)).set({
        isDeleted: true
      }).fetch();

      // Remove association between Event && spareFlagBag
      await Web.removeFromCollection(req.session.eventid, 'comprise').members(existingSpareBag.stationHas.map(bag => bag.id));
      // Remove association between Station && spareFlagBag
      await Station.removeFromCollection(req.params.id, 'stationHas').members(existingSpareBag.stationHas.map(bag => bag.id));


      // No. of spare bag this station has (the updated no.)
      var numToCreate = req.body.Station.numOfSpareBag;

      for (i = 0; i < numToCreate; i++) {
        // create flag bag
        var flagbag = await Flagbag.create(req.body.Flagbag).fetch();

        // Update the flag bag: isSpareBag to true
        await Flagbag.update(flagbag.id).set({
          isSpareBag: true
        }).fetch();

        // Add association
        await Web.addToCollection(req.session.eventid, 'comprise').members(flagbag.id);
        await Station.addToCollection(req.params.id, 'stationHas').members(flagbag.id);
      }

      return res.json({ message: '已更新旗站！', url: '/station/' + req.session.eventid });

    }

  },

  removeStation: async function (req, res) {
    if (req.method == 'GET') { return res.forbidden(); }

    var models = await Station.destroy(req.params.id).fetch();


    if (models.length == 0) { return res.notFound(); }

    return res.json({ message: '已刪除旗站！', url: '/station/' + req.session.eventid });    // for ajax request

  },

  addflagstn: async function (req, res) {

    if (req.method == 'GET') {

      var user = await Web.findOne(req.session.eventid).populate('superviseBy', { where: { role: 'stationmgr', isSelected: false } });

      var web = await Web.findOne(req.session.eventid);

      var stationList = await Web.findOne(req.session.eventid).populate('include');

      return res.view('station/addflagstn', { go: user.superviseBy, name: web.eventName, eventid: req.session.eventid, adminName: req.session.username, stations: stationList.include });

    }

    var stationManagers = await Web.findOne(req.session.eventid).populate('superviseBy', { where: { username: { in: req.body.User.username.split(',').map(s => s.trim()) } } });

    //var stationManagers = await User.find({ username: { in: req.body.User.username.split(',').map(s => s.trim()) }});

    //var u = await Web.findOne(req.session.eventid).populate('superviseby')

    var station = await Station.create(req.body.Station).fetch();

    // No. of spare bag this station has
    var numToCreate = req.body.Station.numOfSpareBag;

    for (i = 0; i < numToCreate; i++) {
      // create flag bag
      var flagbag = await Flagbag.create(req.body.Flagbag).fetch();
      // const qrcode = require('qrcode-generator');
      let code = printf('%06d', flagbag.id);

      // Update the flag bag: isSpareBag to true
      await Flagbag.update(flagbag.id).set({
        isSpareBag: true,
        bagStatus: '未派發',
        bagNumber: code,
      }).fetch();

      // Add association
      await Web.addToCollection(req.session.eventid, 'comprise').members(flagbag.id);
      await Station.addToCollection(station.id, 'stationHas').members(flagbag.id);
    }


    await User.update(stationManagers.superviseBy.map(manager => manager.id)).set({
      isSelected: true
    }).fetch();

    await Station.addToCollection(station.id, 'inside').members(req.session.eventid); // add station to the event

    await Station.addToCollection(station.id, 'monitorBy').members(stationManagers.superviseBy.map(manager => manager.id));

    return res.json({ message: '已新增旗站！', url: '/station/' + req.session.eventid });

  },

  viewStation: async function (req, res) {

    var web = await Web.findOne(req.session.eventid);

    var station = await Station.findOne(req.params.id);

    var sta = await Web.findOne(req.session.eventid).populate('include', { where: { sName: station.sName } });

    var volunteer = await Station.findOne(sta.include[0].id).populate('has', { where: { isContacter: false } });

    var volunteerInStation = await Volunteer.find({ 
      where: { id: volunteer.has.map(v => v.id)},
      sort: 'vName'
    }).populate('assignTo');

    var stationMgr = await Station.findOne(sta.include[0].id).populate('monitorBy', { where: { role: 'stationmgr' } });

    var bag = await Volunteer.find(volunteer.has.map(v => v.id)).populate('assignTo');

    return res.view('station/viewStation', { stationInfo: station, volunteerList: volunteerInStation, name: web.eventName, eventid: req.session.eventid, stationmgrList: stationMgr.monitorBy, volBag: bag.length, totalVol: volunteer.has.length, stationid: req.params.id });

  },

  //export event data into excel file(.xlsx format)(for station.ejs)
  export_station: async function (req, res) {

    var models = await Web.findOne(req.session.eventid).populate('include');

    var volunteers = await Station.find(models.include.map(w => w.id)).populate('has', { where: { isContacter: false } });

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(volunteers.map(model => {
      return {
        旗站名稱: model.sName,
        旗站地區: model.sLocation,
        義工總數: model.has.length,
        後備旗袋: model.numOfSpareBag,
        旗袋總數: (model.has.length + model.numOfSpareBag),
        創建人: model.createdby
      };
    }));
    XLSX.utils.book_append_sheet(wb, ws, '旗站資料');

    res.set('Content-disposition', 'attachment; filename=Station_List.xlsx');
    return res.end(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  },

  export_thisStation: async function (req, res) {

    var sta = await Web.findOne(req.session.eventid).populate('include', { where: { id: req.params.id } })

    var station = await Station.findOne(req.params.id).populate('has', { where: { isContacter: false } });

    //var models = station.has;

    var models = await Volunteer.find({
      where:{ id: station.has.map(s => s.id) },
      sort:'vName'
    }).populate('assignTo');

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(models.map(model => {
      return {
        義工姓名: model.vName,
        聯絡電話: model.vContact,
        旗袋編號: model.assignTo[0].bagNumber
      };
    }));
    XLSX.utils.book_append_sheet(wb, ws, '旗站-' + sta.include[0].sName + '義工列表');

    res.set('Content-disposition', 'attachment; filename=VolunteerInThisStation.xlsx');
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

    var stationmgr = await Web.findOne(req.session.eventid).populate('superviseBy', { where: { role: 'stationmgr' } });

    var models = stationmgr.superviseBy;

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(models.map(model => {
      return {
        用戶名稱: model.username,
        用戶身份: model.role,
        電郵: model.mail,
        創建人: model.createdby
      };
    }));
    XLSX.utils.book_append_sheet(wb, ws, '旗站管理員資料');

    res.set('Content-disposition', 'attachment; filename=StationManager_List.xlsx');
    return res.end(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  },

  //export individual volunteer information(for individual.ejs)
  export_vIndividual: async function (req, res) {

    var models = await Web.findOne(req.session.eventid).populate('include').populate('contain', { where: { vType: 'individual' } });

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var volunteers = await Volunteer.find(models.contain.map(w => w.id)).populate('within').populate('assignTo');

    var ws = XLSX.utils.json_to_sheet(volunteers.map(model => {

      return {
        姓名: model.vName,
        聯絡電話: model.vContact,
        旗站名稱: model.within[0].sName,
        旗袋編號: model.assignTo[0].bagNumber,
        旗袋狀態: model.assignTo[0].bagStatus,
      };

    }));
    XLSX.utils.book_append_sheet(wb, ws, '個人義工資料');

    res.set('Content-disposition', 'attachment; filename=IndividualVolunteer_List.xlsx');
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
        團體姓名: model.vGroupName,
        團體地址: model.vGroupAddress,
        團體義工總人數: model.totalGroupNumber,
        負責人名稱: model.vContacter,
        聯絡電話: model.vContact,
        所屬旗站: model.within[0].sName,
      };
    }));
    XLSX.utils.book_append_sheet(wb, ws, '團體義工資料');

    res.set('Content-disposition', 'attachment; filename=GroupVolunteer_List.xlsx');
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

