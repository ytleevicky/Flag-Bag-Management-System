/* eslint-disable eqeqeq */
/* eslint-disable block-scoped-var */
/**
 * VolunteerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  group: async function (req, res) {

    var model = await Web.findOne(req.session.eventid).populate('contain', { where: { vType: 'group', isContacter: 'true' } });  // for eventName

    var models = await Volunteer.find(model.contain.map(v => v.id)).populate('within');

    // console.log(group.contain[0].id);

    // var abc = await Volunteer.findOne(66).populate('within')

    // var json = JSON.parse(JSON.stringify(abc.within));
    // var show = json[0].sName;
    // console.log(show);

    return res.view('volunteer/group', { name: model.eventName, stations: models, webs: model, eventid: req.session.eventid });

  },

  addGroup: async function (req, res) {

    if (req.method == 'GET') {

      var web = await Web.findOne(req.session.eventid);

      var stationList = await Web.findOne(req.session.eventid).populate('include');

      var groupList = await Web.findOne(req.session.eventid).populate('contain');

      return res.view('volunteer/addGroup', { eventid: req.session.eventid, name: web.eventName, stations: stationList.include, groups: groupList.contain });
    }

    var group = await Volunteer.create(req.body.Volunteer).fetch();

    await Volunteer.addToCollection(group.id, 'in').members(req.session.eventid);      // Add a Volunteer to that particular event

    var station = req.body.Station.sName;

    var stat = await Station.find({ where: { sName: station } });
    var json = JSON.parse(JSON.stringify(stat));
    var stationid = json[0].id;     // To get the stationid

    await Volunteer.addToCollection(group.id, 'within').members(stationid);   // Add volunteer to that particular station

    if (req.wantsJSON) {
      return res.json({ message: '已新增團體！', url: '/group/' + req.session.eventid });
    }
    else {
      return res.redirect('/group/' + req.session.eventid);
    }

  },


  updateGroup: async function (req, res) {

    var stationName = await Volunteer.findOne(req.params.id).populate('within');

    if (req.method == 'GET') {

      // var models = await Web.findOne(req.session.eventid).populate('contain', { where: { vType: 'group'}});

      var models = await Volunteer.findOne(req.params.id).populate('within');
      // var json = JSON.parse(JSON.stringify(models.within));
      // if(models.within.legth >0){
      //   var a = json[0].sName;
      // }else{
      //   a = "";
      // }

      if (!models) { return res.notFound(); }

      var web = await Web.findOne(req.session.eventid);

      var stationList = await Web.findOne(req.session.eventid).populate('include');

      return res.view('volunteer/updateGroup', { groups: models, eventid: req.session.eventid, name: web.eventName, stations: stationList.include });

    }

    else {
      if (!req.body.Volunteer) { return res.badRequest('Form-data not received.'); }


      var vol = await Volunteer.findOne(req.params.id);

      var store = await Web.findOne(req.session.eventid).populate('contain', { where: { vGroupName: vol.vGroupName } });

      // Update all the GroupName in Individual Volunteer
      // (change the groupName from old to new)
      await Volunteer.update(store.contain.map(s => s.id)).set({
        vGroupName: req.body.Volunteer.vGroupName
      }).fetch();

      // Update the information of that particular Group Volunteer
      var models = await Volunteer.update(req.params.id).set({
        vGroupName: req.body.Volunteer.vGroupName,
        vGroupAddress: req.body.Volunteer.vGroupAddress,
        vName: req.body.Volunteer.vName,
        vContact: req.body.Volunteer.vContact
      }).fetch();

      await Volunteer.removeFromCollection(req.params.id, 'within').members(stationName.within.map(s => s.id));
      var stat = await Station.find({ where: { sName: req.body.Station.sName } });
      var json = JSON.parse(JSON.stringify(stat));
      var stationid = json[0].id;     // To get the stationid

      await Volunteer.addToCollection(req.params.id, 'within').members(stationid);


      if (models.length == 0) { return res.notFound(); }

      if (req.wantsJSON) {
        return res.json({ message: '已更新團體！', url: '/group/' + req.session.eventid });
      }
      else {
        return res.redirect('/group/' + req.session.eventid);
      }
    }
  },

  // Remove : For both group volunteer && individual volunteer
  removeVolunteer: async function (req, res) {
    if (req.method == 'GET') { return res.forbidden(); }

    var volunteer = await Volunteer.findOne(req.params.id);
    var models = await Volunteer.destroy(req.params.id).fetch();

    if (volunteer.isContacter == true) {
      // Remove Group Volunteer

      var find = await Web.findOne(req.session.eventid).populate('contain', { where: { vGroupName: volunteer.vGroupName } });

      // Update the volunteers that belongs to this particular Group
      await Volunteer.update(find.contain.map(s => s.id)).set({
        vGroupName: '',
        vType: 'individual'         // Not sure whether it is '' / group / individual
      }).fetch();

      if (models.length == 0) { return res.notFound(); }

      if (req.wantsJSON) {

        return res.json({ message: '已刪除團體義工！', url: '/group/' + req.session.eventid });    // for ajax request

      }

    } else {
      // Remove Individual Volunteer

      if (models.length == 0) { return res.notFound(); }

      if (req.wantsJSON) {

        return res.json({ message: '已刪除個人義工！', url: '/individual/' + req.session.eventid });    // for ajax request

      }

    }



  },

  individual: async function (req, res) {

    var model = await Web.findOne(req.session.eventid).populate('contain', { where: { isContacter: 'false' } });  // for eventName

    var models = await Volunteer.find(model.contain.map(v => v.id)).populate('within');

    return res.view('volunteer/individual', { name: model.eventName, stations: models, webs: model, eventid: req.session.eventid });

  },

  addIndividual: async function (req, res) {

    if (req.method == 'GET') {

      var web = await Web.findOne(req.session.eventid);

      var stationList = await Web.findOne(req.session.eventid).populate('include');

      var groupList = await Web.findOne(req.session.eventid).populate('contain', { where: { vType: 'group', isContacter: 'true' } });

      return res.view('volunteer/addIndividual', { eventid: req.session.eventid, name: web.eventName, groups: groupList.contain, stations: stationList.include});

    }

    var individual = await Volunteer.create(req.body.Volunteer).fetch();

    if (req.body.Volunteer.vGroupName == '') {

      await Volunteer.update(individual.id).set({ vType: 'individual' }).fetch();

    } else {

      await Volunteer.update(individual.id).set({ vType: 'group' }).fetch();

    }

    var flagbag = await Flagbag.create(req.body.Flagbag).fetch();
    await Web.addToCollection(req.session.eventid, 'comprise').members(flagbag.id);
    await Volunteer.addToCollection(individual.id, 'assignTo').members(flagbag.id);
    await Volunteer.addToCollection(individual.id, 'in').members(req.session.eventid);  // 1. Add a Volunteer to that particular event

    var station = req.body.Station.sName;

    var stat = await Station.find({ where: { sName: station } });
    var json = JSON.parse(JSON.stringify(stat));
    var stationid = json[0].id;     // get the stationid

    await Volunteer.addToCollection(individual.id, 'within').members(stationid);   // 2. add volunteer to that particular station

    if (req.wantsJSON) {
      return res.json({ message: '已新增個人義工！', url: '/individual/' + req.session.eventid });
    }
    else {
      return res.redirect('/individual/' + req.session.eventid);
    }

  },


  viewIndividual: async function (req, res) {

    var event = await Web.findOne(req.session.eventid);

    var individual = await Web.findOne(req.session.eventid).populate('contain', { where: { isContacter: 'false', id: req.params.id } });

    var json = JSON.parse(JSON.stringify(individual.contain));
    var abc = json[0];

    var tmp = await Volunteer.findOne(abc.id).populate('within');

    // var json1 = JSON.parse(JSON.stringify(station.within));
    // var tmp = json1[0];

    var bag = await Volunteer.findOne(abc.id).populate('assignTo');

    return res.view('volunteer/viewIndividual', { eventname: event.eventName, eventid: req.session.eventid, go: abc, station: tmp, flagbag: bag.assignTo });

  },

  updateIndividual: async function (req, res) {

    var stationName = await Volunteer.findOne(req.params.id).populate('within');

    if (req.method == 'GET') {

      var web = await Web.findOne(req.session.eventid);

      var models = await Volunteer.findOne(req.params.id).populate('within');

      if (!models) { return res.notFound(); }

      var stationList = await Web.findOne(req.session.eventid).populate('include');

      var findGroup = await Web.findOne(req.session.eventid).populate('contain', { where: { vType: 'group', isContacter: 'true' } });

      return res.view('volunteer/updateIndividual', { individuals: models, eventid: req.session.eventid, name: web.eventName, stations: stationList.include, grouplist: findGroup });

    }

    else {
      if (!req.body.Volunteer) { return res.badRequest('Form-data not received.'); }

      var groupName = req.body.Volunteer.vGroupName;

      if (groupName == '---') {
        var type = 'individual';
        var groupname = '';
      } else {
        var type = 'group';
        var groupname = req.body.Volunteer.vGroupName;
      }


      var models = await Volunteer.update(req.params.id).set({
        vName: req.body.Volunteer.vName,
        vContact: req.body.Volunteer.vContact,
        vGroupName: groupname,
        vType: type
      }).fetch();

      await Volunteer.removeFromCollection(req.params.id, 'within').members(stationName.within.map(s => s.id));
      var stat = await Station.find({ where: { sName: req.body.Station.sName } });
      var json = JSON.parse(JSON.stringify(stat));
      var stationid = json[0].id;     // To get the stationid

      await Volunteer.addToCollection(req.params.id, 'within').members(stationid);

      if (models.length == 0) { return res.notFound(); }

      if (req.wantsJSON) {
        return res.json({ message: '已更新個人義工！', url: '/viewIndividual/' + req.params.id });
      }
      else {
        return res.redirect('/viewIndividual/' + req.params.id);
      }
    }

  },


  print: async function (req, res) {
    const qrcode = require('qrcode-generator');
    var vol = await Volunteer.findOne(req.params.id);
    var stat = await Volunteer.findOne(req.params.id).populate('within');

    var bag = await Volunteer.findOne(vol.id).populate('assignTo');

    await Flagbag.update(bag.assignTo[0].id).set({

      bagStatus: '未派發',
      bagNumber: bag.assignTo[0].id,
      codePrintedTime: bag.assignTo[0].updatedAt,
      isCodePrinted: true,

    }).fetch();

    let qr = qrcode(4, 'H');
    qr.addData(`${bag.assignTo[0].id}`);
    qr.make();

    return res.view('volunteer/print', { volunteer: vol, 'qrsrc': qr.createDataURL(), station: stat });

  },

  //action - populate(for volunteer and station)
  populate_vs: async function (req, res) {

    var model = await Volunteer.findOne(req.params.id).populate('within');

    if (!model) { return res.notFound(); }

    return res.json(model);

  },

  //action - populate(for volunteer and web)
  populate_vw: async function (req, res) {

    var model = await Volunteer.findOne(req.params.id).populate('in');

    if (!model) { return res.notFound(); }

    return res.json(model);

  },

  //action - populate(for volunteer and flagbag)
  populate_vf: async function (req, res) {

    var model = await Volunteer.findOne(req.params.id).populate('assignTo');

    if (!model) { return res.notFound(); }

    return res.json(model);

  },


};

