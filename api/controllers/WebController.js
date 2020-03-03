/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/**
 * WebController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  json: async function (req, res) {

    var webs = await Web.find();

    return res.json(webs);
  },

  index: async function (req, res) {

    var models = await Web.find();
    return res.view('web/index', { webs: models });

  },

  station: async function (req, res) {

    var models = await Web.find();
    return res.view('web/station', { webs: models });

  },

  location: async function (req, res) {

    var models = await Web.find();
    return res.view('web/location', { webs: models });

  },

  setting: async function (req, res) {

    var models = await Web.find();
    return res.view('web/setting', { webs: models });

  },

  contact: async function (req, res) {

    var models = await User.find({
      role: 'stationmgr'
    });

    return res.view('web/contact', { user: models });

  },

  adminDisplay: async function (req, res) {

    var models = await User.find({
      role: 'admin'
    });

    return res.view('web/adminDisplay', { user: models });

  },

  management: async function (req, res) {

    var models = await Web.find();
    return res.view('web/management', { webs: models });

  },

  eventdetail: async function (req, res) {

    var models = await Web.find();
    return res.view('web/eventdetail', { webs: models });

  },

  addflagstn: async function (req, res) {

    var models = await Web.find();
    return res.view('web/addflagstn', { webs: models });

  },

  stationmgrDisplay: async function (req, res) {


    var models = await User.find({
      role: 'stationmgr'
    });

    return res.view('web/stationmgrDisplay', { user: models });

  },

  viewitem: async function (req, res) {

    var models = await Web.find();
    return res.view('web/viewitem', { webs: models });

  },

  personalitem: async function (req, res) {

    var models = await Web.find();
    return res.view('web/personalitem', { webs: models });

  },

  groupitem: async function (req, res) {

    var models = await Web.find();
    return res.view('web/groupitem', { webs: models });

  },

  adduser: async function (req, res) {


    if (req.method == 'GET') { return res.view('web/adduser'); }

    if (!req.body.User) { return res.badRequest('Form-data not received.'); }

    // var password = ;
    // var userID = parseInt(req.body.id);

    sails.bcrypt = require('bcryptjs');
    const saltRounds = 10;

    req.body.User.password = await sails.bcrypt.hash(req.body.User.password, saltRounds);
    var user = await User.create(req.body.User).fetch();

    console.log(JSON.stringify(user));

    if (req.wantsJSON) {

      return res.json({ message: user.role == 'admin' ? '已新增活動管理員！' : '已新增活動使用者！', url: user.role == 'admin' ? '/adminDisplay' : '/contact' });

    }
    return res.redirect('/contact');           // for normal request


    // return res.redirect('/contact');           // for normal request

  },

  addadmin: async function (req, res) {

    if (req.method == 'GET') { return res.view('web/addadmin'); }

    if (!req.body.User) { return res.badRequest('Form-data not received.'); }

    var user = await User.create(req.body.User).fetch();

    await User.create(req.body.User);

    if (req.wantsJSON) {
      if (user.role == 'admin') {
        return res.json({ message: '已新增活動管理員！', url: '/adminDisplay' });    // for ajax request
      }
      else {
        return res.redirect('/adminDisplay');
      }           // for normal request
    }

  },

  stationmanagement: async function (req, res) {

    var models = await Web.find();
    return res.view('web/stationmanagement', { webs: models });

  },

  individual: async function (req, res) {

    var models = await Web.find();
    return res.view('web/individual', { webs: models });

  },

  group: async function (req, res) {

    var models = await Web.find();
    return res.view('web/group', { webs: models });

  },

  addIndividual: async function (req, res) {

    var models = await Web.find();
    return res.view('web/addIndividual', { webs: models });

  },

  addGroup: async function (req, res) {

    var models = await Web.find();
    return res.view('web/addGroup', { webs: models });

  },

  eventreport: async function (req, res) {

    var models = await Web.find();
    return res.view('web/eventreport', { webs: models });

  },

  groupandindividual: async function (req, res) {

    var models = await Web.find();
    return res.view('web/groupandindividual', { webs: models });

  },

  qrCode: async function (req, res) {

    var models = await Web.find();
    return res.view('web/qrCode', { webs: models });

  },

  edituser: async function (req, res) {

    var models = await User.find();
    return res.view('web/edituser', { user: models });

  },

  generateLabel: async function (req, res) {

    var models = await Web.find();
    return res.view('web/generateLabel', { user: models });

  },

  addevent: async function (req, res) {

    var models = await User.find();
    return res.view('web/addevent', { user: models });

  },

  //upload user data
  import_user: async function (req, res) {

    // if (req.method == 'GET')
    // {return res.view('web/import_xlsx');}

    req.file('file').upload({ maxBytes: 10000000 }, async function whenDone(err, uploadedFiles) {
      if (err) { return res.serverError(err); }
      if (uploadedFiles.length === 0) { return res.badRequest('No file was uploaded'); }

      var XLSX = require('xlsx');
      var workbook = XLSX.readFile(uploadedFiles[0].fd);
      var ws = workbook.Sheets[workbook.SheetNames[0]];
      var data = XLSX.utils.sheet_to_json(ws);
      console.log(data);
      var models = await User.createEach(data).fetch();
      if (models.length == 0) {
        return res.badRequest('No data imported.');
      }
      return res.ok('Excel file imported.');
    });
  },

  //export user data
  export_admin: async function (req, res) {

    var models = await User.find({role:'admin'});

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
    XLSX.utils.book_append_sheet(wb, ws, 'Admin_List');

    res.set('Content-disposition', 'attachment; filename=Admin_List.xlsx');
    return res.end(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  },

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

  //upload event data
  import_event: async function (req, res) {

    // if (req.method == 'GET')
    // {return res.view('web/import_xlsx');}

    req.file('file').upload({ maxBytes: 10000000 }, async function whenDone(err, uploadedFiles) {
      if (err) { return res.serverError(err); }
      if (uploadedFiles.length === 0) { return res.badRequest('No file was uploaded'); }

      var XLSX = require('xlsx');
      var workbook = XLSX.readFile(uploadedFiles[0].fd);
      var ws = workbook.Sheets[workbook.SheetNames[0]];
      var data = XLSX.utils.sheet_to_json(ws);
      console.log(data);
      var models = await Web.createEach(data).fetch();
      if (models.length == 0) {
        return res.badRequest('No data imported.');
      }
      return res.ok('Excel file imported.');
    });
  },

  //export event data into excel file(.xlsx format)(for individual.ejs)
  export_event: async function (req, res) {

    var models = await Web.find();

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(models.map(model => {
      return {
        vName: model.vName, //賣旗者姓名
        vGroupName: model.vGroupName, //賣旗團體名
        sLocation: model.sLocation, //旗站位置
        bagNumber: model.bagNumber, //旗袋編號
        bagStats: model.bagStats, //旗袋狀態
        bagUpdate: model.bagUpdate, //旗袋最後更新時間
        codePrinted: model.codePrinted, //最後列印標籤時間
      };
    }));
    XLSX.utils.book_append_sheet(wb, ws, 'Event_List');

    res.set('Content-disposition', 'attachment; filename=Event_List.xlsx');
    return res.end(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  },

  //export event data into excel file(.xlsx format)(for group.ejs)
  export_group: async function (req, res) {

    var models = await Web.find();

    var XLSX = require('xlsx');
    var wb = XLSX.utils.book_new();

    var ws = XLSX.utils.json_to_sheet(models.map(model => {
      return {
        vGroupName: model.vGroupName, //賣旗團體名
        sLocation: model.sLocation, //旗站位置
        bagNumber: model.location, //賣旗地區
        bagStats: model.numOfV, //義工人數
      };
    }));
    XLSX.utils.book_append_sheet(wb, ws, 'Group_List');

    res.set('Content-disposition', 'attachment; filename=Group_List.xlsx');
    return res.end(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
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

};

