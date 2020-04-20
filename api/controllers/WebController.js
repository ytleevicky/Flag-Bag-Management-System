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

    req.body.Web.data_timestamp = new Date().toISOString();
    return res.json(webs);
  },

  adminDisplay: async function (req, res) {

    req.session.eventid = '';

    var models = await User.find({
      role: 'admin'
    });

    return res.view('web/adminDisplay', { user: models });

  },

  management: async function (req, res) {

    var models = await Web.find();

    return res.view('web/management', { webs: models });

  },


  viewitem: async function (req, res) {

    var models = await Web.findOne(req.params.id);
    if (!models) { return res.notFound(); }

    req.session.eventid = models.id;

    var station = await Web.findOne(req.session.eventid).populate('include');
    var nStation = station.include.length;

    var vol = await Web.findOne(req.session.eventid).populate('contain', { where: { isContacter: 'false' } });
    var nVol = vol.contain.length;

    var stationUser = await Web.findOne(req.session.eventid).populate('superviseBy', { where: { role: 'stationmgr' } });
    var nUser = stationUser.superviseBy.length;

    // Later add the spare bag no.
    var bag = await Web.findOne(req.session.eventid).populate('comprise');
    var nBag = bag.comprise.length;

    var spareBag = await Web.findOne(req.session.eventid).populate('comprise', { where: { isSpareBag: true, isDeleted: false  }});

    var group = await Web.findOne(req.session.eventid).populate('contain', { where: { vType: 'group', isContacter: 'true' } });
    var nGroup = group.contain.length;

    return res.view('web/viewitem', { webs: models, eventid: req.session.eventid, numOfStation: nStation, numOfVol: nVol, numOfStationmgr: nUser, numOfBag: nBag, numOfGroup: nGroup, numOfSpareBag: spareBag.comprise.length });

  },

  adduser: async function (req, res) {

    if (req.method == 'GET') {

      if (!req.session.username) {

        return res.status(403);

      }

      if (!req.session.eventid) {

        var adminList = await User.find({
          where: { role: 'admin' }
        });

        return res.view('web/adduser', { eventid: '', users: adminList });


      } else {
        var models = await Web.findOne(req.session.eventid);

        //var stationmgrList = await Web.findOne(req.session.eventid).populate('superviseBy', { where: { role: 'stationmgr' } });

        var stationmgrList = await User.find({ where: { role: 'stationmgr' } });

        return res.view('web/adduser', { name: models.eventName, eventid: req.session.eventid, web: models, users: stationmgrList });

      }
    }


    if (!req.body.User) { return res.badRequest('Form-data not received.'); }

    sails.bcrypt = require('bcryptjs');
    const saltRounds = 10;

    req.body.User.password = await sails.bcrypt.hash(req.body.User.password, saltRounds);

    req.body.User.createdby = await req.session.username;

    var user = await User.create(req.body.User).fetch();
    console.log(JSON.stringify(user));


    if (req.session.eventid == '') {
      if (req.wantsJSON) {
        return res.json({ message: '已新增活動管理員！', url: '/adminDisplay/' });
      }
      else { return res.status(200).redirect('/adminDisplay'); }
    }

    else {
      await User.addToCollection(user.id, 'edit').members(req.session.eventid);
      if (req.wantsJSON) {
        return res.json({ message: '已新增旗站管理員！', url: '/stationmgrDisplay/' + req.session.eventid });
      }
      else { return res.status(200).redirect('/stationmgrDisplay' + req.session.eventid); }
    }

  },

  addevent: async function (req, res) {

    if (req.method == 'GET') { return res.view('web/addevent'); }

    if (!req.body.Web) { return res.badRequest('Form-data not received.'); }

    await Web.create(req.body.Web);

    if (req.wantsJSON) {
      return res.json({ message: '已新增活動', url: '/management' });    // for ajax request
    } else {
      return res.status(200).redirect('/management');// for normal request
    }
  },

  updateEvent: async function (req, res) {

    if (req.method == 'GET') {

      var model = await Web.findOne(req.session.eventid);

      if (!model) { return res.notFound(); }

      return res.view('web/updateEvent', { web: model, eventid: req.session.eventid, name: model.eventName });


    } else {


      if (!req.body.Web) { return res.badRequest('Form-data not received.'); }


      var models = await Web.update(req.params.id).set({

        eventName: req.body.Web.eventName,
        dateOfEvent: req.body.Web.dateOfEvent,
        eventLocation: req.body.Web.eventLocation,

      }).fetch();

      if (models.length == 0) { return res.notFound(); }


      return res.json({ message: '已更新活動摘要！', url: '/viewitem/' + req.params.id });

    }

  },

  removeEvent: async function (req, res) {
    if (req.method == 'GET') { return res.forbidden(); }

    var users = await Web.findOne(req.params.id).populate('superviseBy');
    await User.destroy(users.superviseBy.map(u => u.id)).fetch();

    var stations = await Web.findOne(req.params.id).populate('include');
    await Station.destroy(stations.include.map(s => s.id)).fetch();

    var volunteers = await Web.findOne(req.params.id).populate('contain');
    await Volunteer.destroy(volunteers.contain.map(v => v.id)).fetch();

    var bags = await Web.findOne(req.params.id).populate('comprise');
    await Flagbag.destroy(bags.comprise.map(b => b.id)).fetch();

    var models = await Web.destroy(req.params.id).fetch();

    if (models.length == 0) { return res.notFound(); }

    return res.json({ message: '已刪除活動！', url: '/management' });    // for ajax request

  },

  //for stationmgrDisplay.ejs
  stationmgrDisplay: async function (req, res) {

    var models = await Web.findOne(req.session.eventid).populate('superviseBy', { where: { role: 'stationmgr' } });
    if (!models) { return res.notFound(); }

    var web = await Web.findOne(req.session.eventid);

    return res.view('station/stationmgrDisplay', { name: web.eventName, go: models.superviseBy, eventid: req.session.eventid });

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


      var user = await User.createEach(data).fetch();

      var models = await User.addToCollection(user.id, 'edit').members(req.session.eventid);

      if (models.length == 0) {
        return res.badRequest('No data imported.');
      }

      // Check the role to decide redirection
      if (models[0].role == 'admin') {          // using models[0] to check the role (to be modified)
        return res.redirect('/adminDisplay');
      }

      return res.redirect('/stationmgrDisplay/' + req.session.eventid);

    });
  },

  //export user data
  export_admin: async function (req, res) {

    var models = await User.find({ role: 'admin' });

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
    XLSX.utils.book_append_sheet(wb, ws, '活動管理員資料');

    res.set('Content-disposition', 'attachment; filename=Admin_List.xlsx');
    return res.end(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  },

  updateUser: async function (req, res) {

    if (req.method == 'GET') {

      var model = await User.findOne(req.params.id);

      if (!model) { return res.notFound(); }

      if (!req.session.eventid) {
        if (req.method == 'GET') { return res.view('web/updateUser', { user: model, eventid: '' }); }
      } else {
        var web = await Web.findOne(req.session.eventid);
        if (req.method == 'GET') { return res.view('web/updateUser', { user: model, eventid: req.session.eventid, name: web.eventName }); }
      }

    } else {

      if (!req.body.User) { return res.badRequest('Form-data not received.'); }

      sails.bcrypt = require('bcryptjs');
      const saltRounds = 10;

      var models = await User.update(req.params.id).set({
        username: req.body.User.username,
        password: await sails.bcrypt.hash(req.body.User.password, saltRounds),
        role: req.body.User.role,
        mail: req.body.User.mail,
        // flagstn: req.body.User.flagstn
      }).fetch();

      if (models.length == 0) { return res.notFound(); }

      if (req.wantsJSON) {
        if (req.body.User.role == 'admin') {
          return res.json({ message: '已更新活動管理員！', url: '/adminDisplay' });
        }
        else {
          return res.json({ message: '已更新旗站站長！', url: '/stationmgrDisplay/' + req.session.eventid });    // for ajax request
        }
      } else {
        return res.redirect('/adminDisplay');           // for normal request
      }


    }
  },


  removeUser: async function (req, res) {
    if (req.method == 'GET') { return res.forbidden(); }

    var models = await User.destroy(req.params.id).fetch();

    if (models.length == 0) { return res.notFound(); }

    if (req.wantsJSON) {
      if (models[0].role == 'admin') {
        return res.json({ message: '已刪除活動管理員！', url: '/adminDisplay' });
      }
      else {
        return res.json({ message: '已刪除旗站站長！', url: '/stationmgrDisplay/' + req.session.eventid });    // for ajax request
      }
    }

  },

  //action - populate(for web and user)
  populate_wu: async function (req, res) {

    var model = await Web.findOne(req.params.id).populate('superviseBy');

    if (!model) { return res.notFound(); }

    return res.json(model);

  },

  //action - populate(for web and station)
  populate_ws: async function (req, res) {

    var model = await Web.findOne(req.params.id).populate('include');

    if (!model) { return res.notFound(); }

    return res.json(model);

  },

  //action - populate(for web and volunteer)
  populate_wv: async function (req, res) {

    var model = await Web.findOne(req.params.id).populate('contain');

    if (!model) { return res.notFound(); }

    return res.json(model);

  },

  //action - populate(for web and flagbag)
  populate_wf: async function (req, res) {

    var model = await Web.findOne(req.params.id).populate('comprise');

    if (!model) { return res.notFound(); }

    return res.json(model);

  },

};

