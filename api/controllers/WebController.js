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

    req.body.Web.data_timestamp = new Date().toISOString
    return res.json(webs);
  },

  index: async function (req, res) {

    var models = await Web.find();
    return res.view('web/index', { webs: models });

  },

  location: async function (req, res) {

    var models = await Web.find();
    return res.view('web/location', { webs: models });

  },

  setting: async function (req, res) {

    var models = await Web.find();
    return res.view('web/setting', { webs: models });

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

  addflagstn: async function (req, res) {

    if (req.method == 'GET') {

      var user = await Web.findOne(req.session.eventid).populate('superviseBy', { where: { role: 'stationmgr' } });

      var web = await Web.findOne(req.session.eventid);

      var stationList = await Web.findOne(req.session.eventid).populate('include');

      return res.view('station/addflagstn', { go: user.superviseBy, name: web.eventName, eventid: req.session.eventid, adminName: req.session.username, stations: stationList.include });

    }

    var stationManagers = await User.find({ username: { in: req.body.User.username.split(',').map(s => s.trim()) } });

    var station = await Station.create(req.body.Station).fetch();
   
    await Station.addToCollection(station.id, 'inside').members(req.session.eventid); // add station to the event

    await Station.addToCollection(station.id, 'monitorBy').members(stationManagers.map(manager => manager.id));
   

    if (req.wantsJSON) {
      return res.json({ message: '已新增旗站！', url: '/station/' + req.session.eventid });
    }
    else {
      return res.redirect('/station/' + req.session.eventid);
    }


  },


  viewitem: async function (req, res) {

    var models = await Web.findOne(req.params.id);
    if (!models) { return res.notFound(); }

    req.session.eventid = models.id;

    var model = await Station.find();

    return res.view('web/viewitem', { webs: models, stations: model, eventid: req.session.eventid });

  },

  collectBag: async function (req, res) {

    var models = await Web.find();
    return res.view('web/collectBag', { webs: models });

  },

  distributeBag: async function (req, res) {

    var models = await Web.find();
    return res.view('web/distributeBag', { webs: models });

  },

  adduser: async function (req, res) {

    if (!req.session.eventid) {
      if (req.method == 'GET') { return res.view('web/adduser', { eventid: '' }); }  // for add admin
    } else {
      var models = await Web.findOne(req.session.eventid);
      if (req.method == 'GET') { return res.view('web/adduser', { name: models.eventName, eventid: req.session.eventid, web: models }); } // for add event user
    }

    if (!req.body.User) { return res.badRequest('Form-data not received.'); }

    sails.bcrypt = require('bcryptjs');
    const saltRounds = 10;

    req.body.User.password = await sails.bcrypt.hash(req.body.User.password, saltRounds);

    req.body.User.createdby = await req.session.username;

    var user = await User.create(req.body.User).fetch();
    console.log(JSON.stringify(user));

    // eslint-disable-next-line block-scoped-var
    if (!models) {
      if (req.wantsJSON) {
        return res.json({ message: '已新增活動管理員！', url: '/adminDisplay/'});
      }
      else{ return res.redirect('/adminDisplay'); }
    } 
    
    else {
      await User.addToCollection(user.id, 'edit').members(req.session.eventid);
      if (req.wantsJSON) {
        return res.json({ message: '已新增旗站管理員！', url: '/stationmgrDisplay/' + req.session.eventid});
      }
      else{ return res.redirect('/stationmgrDisplay' + req.session.eventid); }
    } 




  },

  addevent: async function (req, res) {

    if (req.method == 'GET') { return res.view('web/addevent'); }

    if (!req.body.Web) { return res.badRequest('Form-data not received.'); }

    await Web.create(req.body.Web);

    if (req.wantsJSON) {
      return res.json({ message: '已新增活動', url: '/management' });    // for ajax request
    } else {
      return res.redirect('/management');// for normal request
    }
  },

  updateEvent: async function (req, res) {

    if (req.method == 'GET') {

      var model = await Web.findOne(req.params.id);
      var findeventLocation = await Web.findOne(req.session.eventid);

      if (!model) { return res.notFound(); }

      if (!req.session.eventid) {
        if (req.method == 'GET') { return res.view('web/updateEvent', { web: model, eventid: req.session.eventid, name: web.eventName, LocationList: findeventLocation }); }
      } else {
        var web = await Web.findOne(req.session.eventid);
        if (req.method == 'GET') { return res.view('web/updateEvent', { web: model, eventid: req.session.eventid, name: web.eventName, LocationList: findeventLocation }); }
      }

    } else {

      if (!req.body.Web) { return res.badRequest('Form-data not received.'); }

      var models = await Web.update(req.params.id).set({
       
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

  //for stationmgrDisplay.ejs
  stationmgrDisplay: async function (req, res) {

    var models = await Web.findOne(req.session.eventid).populate('superviseBy', { where: { role: 'stationmgr' } });
    if (!models) { return res.notFound(); }

    var web = await Web.findOne(req.session.eventid);

    return res.view('station/stationmgrDisplay', { name: web.eventName, go: models.superviseBy, eventid: req.session.eventid });

  },


  eventreport: async function (req, res) {

    var models = await Web.find();
    return res.view('web/eventreport', { webs: models });

  },

  groupandindividual: async function (req, res) {

    var models = await Web.findOne(req.session.eventid);
    return res.view('web/groupandindividual', { webs: models, name: models.eventName, eventid: req.session.eventid });

  },

  qrCode: async function (req, res) {

    var models = await Web.find();

    var web = await Web.findOne(req.session.eventid);
    return res.view('web/qrCode', { webs: models, name: web.eventName, eventid: req.session.eventid });

  },

  edituser: async function (req, res) {

    var models = await User.find();
    return res.view('web/edituser', { user: models });

  },

  generateLabel: async function (req, res) {

    var qrcode = require('qrcode-generator');
    var qr = qrcode(4, 'L');
    qr.addData('https//sailsjs.com/');    // data that stored inside the QR code
    qr.make();

    var models = await Web.findOne(req.session.eventid);

    return res.view('web/generateLabel', { user : models, 'qrsrc':qr.createDataURL() });

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
        username: model.username,
        role: model.role,
        mail: model.mail,
        // flagstn: model.flagstn,
        // password: model.password,
        createdby: model.createdby
      };
    }));
    XLSX.utils.book_append_sheet(wb, ws, 'Admin_List');

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


  updateStation: async function (req, res) {

    var model = await Station.findOne(req.params.id).populate('monitorBy');
    if (req.method == 'GET') {

      var event = await Web.findOne(req.session.eventid).populate('superviseBy');

      var users = event.superviseBy.filter(u => u.role == 'stationmgr');

      if (!model) { return res.notFound(); }

      // var stationManagers = model.monitorBy.map(manager => manager.username).join(', ')

      //var user1 = await User.find(req.session.eventid).populate('superviseBy', { where: {role: 'stationmgr'} });
      // var users = await User.find({role:'stationmgr', });

      // var user = await Station.findOne(req.params.id).populate('monitorBy');


      var web = await Web.findOne(req.session.eventid);


      return res.view('web/updateStation', { station: model, eventid: req.session.eventid, name: web.eventName, users: users });


    } else {

      if (!req.body.User || !req.body.Station) { return res.badRequest('Form-data not received.'); }

      sails.bcrypt = require('bcryptjs');
      const saltRounds = 10;

      var stationManagers = await User.find({ username: { in: req.body.User.username.split(',').map(s => s.trim()) } });



      // users.map()

      var models = await Station.update(req.params.id).set({
        sName: req.body.Station.sName,
        sLocation: req.body.Station.sLocation,
        numOfSpareBag: req.body.Station.numOfSpareBag,
        // username: req.body.User.username,
      }).fetch();

      if (models.length > 0) {
        if (model.monitorBy.length > 0) { await Station.removeFromCollection(req.params.id, 'monitorBy').members(model.monitorBy.map(u => u.id)); }
        await Station.addToCollection(req.params.id, 'monitorBy').members(stationManagers.map(manager => manager.id));
      } else { return res.notFound(); }

      if (req.wantsJSON) {

        return res.json({ message: '已更新旗站！', url: '/station/' + req.session.eventid });

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

  station: async function (req, res) {

    var models = await Web.findOne(req.session.eventid).populate('include', { where: { numOfSpareBag: { '!=': 0 } } });
    if (!models) { return res.notFound(); }

    var web = await Web.findOne(req.session.eventid);

    return res.view('station/station', { name: web.eventName, go: models.include, eventid: req.session.eventid });

  },

  removeStation: async function (req, res) {
    if (req.method == 'GET') { return res.forbidden(); }
    
    var models = await Station.destroy(req.params.id).fetch();


    if (models.length == 0) { return res.notFound(); }

    if (req.wantsJSON) {

      return res.json({ message: '已刪除旗站！', url: '/station/' + req.session.eventid });    // for ajax request

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

