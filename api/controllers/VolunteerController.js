/* eslint-disable eqeqeq */
/* eslint-disable block-scoped-var */
/**
 * VolunteerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var printf = require('printf');

module.exports = {

  group: async function (req, res) {

    var model = await Web.findOne(req.session.eventid).populate('contain', { where: { vType: 'group', isContacter: 'true' } });  // for eventName

    var models = await Volunteer.find(model.contain.map(v => v.id)).populate('within');



    return res.view('volunteer/group', { name: model.eventName, stations: models, webs: model, eventid: req.session.eventid });

  },

  addGroup: async function (req, res) {

    if (req.method == 'GET') {

      var web = await Web.findOne(req.session.eventid);

      var stationList = await Web.findOne(req.session.eventid).populate('include');

      var groupList = await Web.findOne(req.session.eventid).populate('contain');

      return res.view('volunteer/addGroup', { eventid: req.session.eventid, name: web.eventName, stations: stationList.include, groups: groupList.contain });
    }

    var station = await Web.findOne(req.session.eventid).populate('include', { where: { sName: req.body.Station.sName } });

    var groupNum = req.body.Volunteer.totalGroupNumber;
    var groupName = req.body.Volunteer.vGroupName;
    var groupAdd = req.body.Volunteer.vGroupAddress;
    var contacterName = req.body.leaderName;
    var contactNumber = req.body.leaderContact;

    for (i = 1; i <= groupNum; i++) {

      var groupV = await Volunteer.create().fetch();

      await Volunteer.update(groupV.id).set({
        vName: req.body.Volunteer.vGroupName + ' - 義工' + (i),
        vGroupName: groupName,
        vGroupAddress: groupAdd,
        vContacter: contacterName,
        vContact: contactNumber,
        vType: 'group',
        totalGroupNumber: groupNum,
        isContacter: false
      }).fetch();

      await Web.addToCollection(req.session.eventid, 'contain').members(groupV.id);   // Add volunteer to that particular event

      await Volunteer.addToCollection(groupV.id, 'within').members(station.include[0].id);

      var bag = await Flagbag.create().fetch();

      await Flagbag.update(bag.id).set({
        bagStatus: '未派發'
      }).fetch();

      await Web.addToCollection(req.session.eventid, 'comprise').members(bag.id);

      await Volunteer.addToCollection(groupV.id, 'assignTo').members(bag.id);

    }

    var groupLeader = await Volunteer.create(req.body.Volunteer).fetch();

    await Volunteer.update(groupLeader.id).set({
      vGroupName: groupName,
      vGroupAddress: groupAdd,
      vContacter: contacterName,
      vContact: contactNumber,
      vType: 'group',
      totalGroupNumber: groupNum,
      isContacter: true
    }).fetch();

    await Volunteer.addToCollection(groupLeader.id, 'in').members(req.session.eventid);

    await Volunteer.addToCollection(groupLeader.id, 'within').members(station.include[0].id);


    return res.json({ message: '已新增團體！', url: '/group/' + req.session.eventid });

  },

  viewGroup: async function (req, res) {

    var web = await Web.findOne(req.session.eventid);

    var vol = await Web.findOne(req.session.eventid).populate('contain', { where: { id: req.params.id } });

    var stationInfo = await Volunteer.findOne(vol.contain[0].id).populate('within');

    var model = await Web.findOne(req.session.eventid).populate('contain', { where: { vGroupName: vol.contain[0].vGroupName, isContacter: false } });

    var getVolunteers = await Volunteer.find(model.contain.map(v => v.id)).populate('within').populate('assignTo');

    return res.view('volunteer/viewGroup', { eventid: req.session.eventid, name: web.eventName, station: stationInfo, volunteerList: getVolunteers, group: vol.contain[0], inGroup: req.params.id });

  },


  updateGroup: async function (req, res) {

    var stationName = await Volunteer.findOne(req.params.id).populate('within');

    var volBefore = await Web.findOne(req.session.eventid).populate('contain', { where: { id: req.params.id } });

    var groupBefore = await Web.findOne(req.session.eventid).populate('contain', { where: { vGroupName: volBefore.contain[0].vGroupName } });


    if (req.method == 'GET') {

      var models = await Volunteer.findOne(req.params.id).populate('within');

      if (!models) { return res.notFound(); }

      var web = await Web.findOne(req.session.eventid);

      var stationList = await Web.findOne(req.session.eventid).populate('include');

      return res.view('volunteer/updateGroup', { groups: models, eventid: req.session.eventid, name: web.eventName, stations: stationList.include });

    }

    else {

      if (!req.body.Volunteer) { return res.badRequest('Form-data not received.'); }

      var vol = await Web.findOne(req.session.eventid).populate('contain', { where: { id: req.params.id } });

      var groupLeader = await Volunteer.update(vol.contain[0].id).set({
        vGroupName: req.body.Volunteer.vGroupName,
        vGroupAddress: req.body.Volunteer.vGroupAddress,
        vContacter: req.body.Volunteer.vContacter,
        vContact: req.body.Volunteer.vContact,
        totalGroupNumber: req.body.Volunteer.totalGroupNumber
      }).fetch();

      var newStationName = req.body.Station.sName;

      var station = await Web.findOne(req.session.eventid).populate('include', { where: { sName: newStationName } });
    
      if(stationName.within[0] == undefined){

      } else {
        await Volunteer.removeFromCollection(groupLeader[0].id, 'within').members(stationName.within[0].id);
      }

      await Volunteer.addToCollection(groupLeader[0].id, 'within').members(station.include[0].id);

      var getVolunteers = await Web.findOne(req.session.eventid).populate('contain', { where: { vGroupName: groupBefore.contain[0].vGroupName, isContacter: false } });

      var bagsNeedToBeDeleted = await Volunteer.find(getVolunteers.contain.map(v => v.id)).populate('assignTo');


      for (i = 0; i < getVolunteers.contain.length; i++) {

        await Volunteer.removeFromCollection(getVolunteers.contain[i].id, 'assignTo').members(bagsNeedToBeDeleted[i].assignTo[0].id);

        await Flagbag.destroy(bagsNeedToBeDeleted[i].assignTo[0].id).fetch();

      }

      for (i = 0; i < getVolunteers.contain.length; i++) {

        await Volunteer.removeFromCollection(getVolunteers.contain[i].id, 'in').members(req.session.eventid);

        if(stationName.within[0] == undefined){

        } else {
        await Volunteer.removeFromCollection(getVolunteers.contain[i].id, 'within').members(stationName.within[0].id);
        }

        await Volunteer.destroy(getVolunteers.contain[i].id).fetch();

      }

      var updateNum = req.body.Volunteer.totalGroupNumber;

      for (i = 1; i <= updateNum; i++) {

        var groupV = await Volunteer.create().fetch();

        await Volunteer.update(groupV.id).set({
          vName: req.body.Volunteer.vGroupName + ' - 義工' + (i),
          vGroupName: req.body.Volunteer.vGroupName,
          vGroupAddress: req.body.Volunteer.vGroupAddress,
          vContacter: req.body.Volunteer.vContacter,
          vContact: req.body.Volunteer.vContact,
          vType: 'group',
          totalGroupNumber: req.body.Volunteer.totalGroupNumber,
          isContacter: false
        }).fetch();

        await Volunteer.addToCollection(groupV.id, 'in').members(req.session.eventid);
        await Volunteer.addToCollection(groupV.id, 'within').members(station.include[0].id);

        var bag = await Flagbag.create().fetch();

        await Flagbag.update(bag.id).set({
          bagStatus: '未派發'
        }).fetch();

        await Web.addToCollection(req.session.eventid, 'comprise').members(bag.id);

        await Volunteer.addToCollection(groupV.id, 'assignTo').members(bag.id);

      }

      return res.json({ message: '已更新團體！', url: '/viewGroup/' + req.params.id });

    }
  },

  // Remove : For both group volunteer && individual volunteer
  removeVolunteer: async function (req, res) {
    if (req.method == 'GET') { return res.forbidden(); }

    var volunteer = await Web.findOne(req.session.eventid).populate('contain', { where: { id: req.params.id } });

    if (volunteer.contain[0].isContacter == true) {

      var find = await Web.findOne(req.session.eventid).populate('contain', { where: { vGroupName: volunteer.contain[0].vGroupName } });

      // remove all the group volunteer
      for (i = 0; i < find.contain.length; i++) {

        await Volunteer.destroy(find.contain[i].id).fetch();

      }

      await Volunteer.destroy(volunteer.contain[0].id);   // remove groupLeader

      return res.json({ message: '已刪除團體義工！', url: '/group/' + req.session.eventid });    // for ajax request

    } else {
      // Remove Individual Volunteer

      await Volunteer.destroy(volunteer.contain[0].id);

      return res.json({ message: '已刪除個人義工！', url: '/individual/' + req.session.eventid });    // for ajax request

    }

  },

  individual: async function (req, res) {

    var model = await Web.findOne(req.session.eventid).populate('contain', { where: { vType: 'individual' } });  // for eventName

    var models = await Volunteer.find(model.contain.map(v => v.id)).populate('within').populate('assignTo');

    return res.view('volunteer/individual', { name: model.eventName, stations: models, webs: model, eventid: req.session.eventid });

  },

  addIndividual: async function (req, res) {

    if (req.method == 'GET') {

      var web = await Web.findOne(req.session.eventid);

      var stationList = await Web.findOne(req.session.eventid).populate('include');

      var groupList = await Web.findOne(req.session.eventid).populate('contain', { where: { vType: 'group', isContacter: 'true' } });

      return res.view('volunteer/addIndividual', { eventid: req.session.eventid, name: web.eventName, groups: groupList.contain, stations: stationList.include });

    }

    var individual = await Volunteer.create(req.body.Volunteer).fetch();

    var flagbag = await Flagbag.create(req.body.Flagbag).fetch();

    await Flagbag.update(flagbag.id).set({
      bagStatus: '未派發'
    }).fetch();

    await Web.addToCollection(req.session.eventid, 'comprise').members(flagbag.id);
    await Volunteer.addToCollection(individual.id, 'assignTo').members(flagbag.id);
    await Volunteer.addToCollection(individual.id, 'in').members(req.session.eventid);  // 1. Add a Volunteer to that particular event

    var station = req.body.Station.sName;

    var stat = await Station.find({ where: { sName: station } });
    var json = JSON.parse(JSON.stringify(stat));
    var stationid = json[0].id;     // get the stationid

    await Volunteer.addToCollection(individual.id, 'within').members(stationid);   // 2. add volunteer to that particular station


    return res.json({ message: '已新增個人義工！', url: '/individual/' + req.session.eventid });

  },


  viewIndividual: async function (req, res) {

    var event = await Web.findOne(req.session.eventid);

    var individual = await Web.findOne(req.session.eventid).populate('contain', { where: { isContacter: 'false', id: req.params.id } });

    var json = JSON.parse(JSON.stringify(individual.contain));
    var abc = json[0];

    var tmp = await Volunteer.findOne(abc.id).populate('within');

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

      var findIndividual = await Web.findOne(req.session.eventid).populate('contain', { where: { isContacter: false, id: req.params.id } });

      var stationbag = await Volunteer.findOne(req.params.id).populate('assignTo');

      return res.view('volunteer/updateIndividual', { individuals: models, eventid: req.session.eventid, name: web.eventName, stations: stationList.include, grouplist: findGroup, individualList: findIndividual, bag: stationbag });

    }

    else {
      if (!req.body.Volunteer) { return res.badRequest('Form-data not received.'); }

      var groupName = req.body.Volunteer.vGroupName;

      if (groupName == '---') {
        type = 'individual';
        groupname = '';
      } else {
        type = 'group';
        groupname = req.body.Volunteer.vGroupName;
      }

      var updateModels = await Volunteer.update(req.params.id).set({

        vName: req.body.Volunteer.vName,
        vContact: req.body.Volunteer.vContact,
        vGroupName: groupname,
        vType: type,

      }).fetch();

      await Volunteer.removeFromCollection(req.params.id, 'within').members(stationName.within.map(s => s.id));
      var stat = await Station.find({ where: { sName: req.body.Station.sName } });
      var json = JSON.parse(JSON.stringify(stat));
      var stationid = json[0].id;     // To get the stationid

      await Volunteer.addToCollection(req.params.id, 'within').members(stationid);

      if (updateModels.length == 0) { return res.notFound(); }

      return res.json({ message: '已更新個人義工！', url: '/viewIndividual/' + req.params.id });

    }

  },


  print: async function (req, res) {
    const qrcode = require('qrcode-generator');
    var vol = await Volunteer.findOne(req.params.id);
    var stat = await Volunteer.findOne(req.params.id).populate('within');

    var bag = await Volunteer.findOne(vol.id).populate('assignTo');

    let code = printf('%06d', bag.assignTo[0].id);

    await Flagbag.update(bag.assignTo[0].id).set({

      bagStatus: '已派發',
      bagNumber: code,
      codePrintedTime: bag.assignTo[0].updatedAt,
      isCodePrinted: true,

    }).fetch();

    var updatedBag = await Volunteer.findOne(vol.id).populate('assignTo');

    return res.view('volunteer/print', { volunteer: vol, 'qrcode': qrcode, station: stat, f: updatedBag });

  },

  printLabels: async function (req, res) {

    const qrcode = require('qrcode-generator');

    var data = typeof req.body.c === 'string' ? [req.body.c] : req.body.c;

    if (req.body.c == undefined) {
      res.status(401);
      return res.view('alert', { message: '請先選擇列印項目', url: '/individual/' + req.session.eventid });
    }

    var vol = await Web.findOne(req.session.eventid).populate('contain', { where: { id: data.map(v => parseInt(v)) } });

    var volu = await Volunteer.find(vol.contain.map(v => v.id)).populate('within').populate('assignTo');

    for (i = 0; i < volu.length; i++) {
      let code = printf('%06d', volu[i].assignTo[0].id);
      await Flagbag.update(volu[i].assignTo[0].id).set({

        bagStatus: '已派發',
        bagNumber: code,
        codePrintedTime: volu[i].assignTo[0].updatedAt,
        isCodePrinted: true,

      }).fetch();

    }

    var updatedVolu = await Volunteer.find(vol.contain.map(v => v.id)).populate('within').populate('assignTo');

    return res.view('volunteer/printLabels', { volunteer: vol, 'qrcode': qrcode, station: updatedVolu });
  },

  printGroupQR: async function (req, res) {

    const qrcode = require('qrcode-generator');

    var data = typeof req.body.c === 'string' ? [req.body.c] : req.body.c;

    if (req.body.c == undefined) {
      res.status(401);
      return res.view('alert', { message: '請先選擇列印項目', url: '/viewGroup/' + req.params.id });
    }

    var vol = await Web.findOne(req.session.eventid).populate('contain', { where: { id: data.map(v => parseInt(v)) } });

    var volu = await Volunteer.find(vol.contain.map(v => v.id)).populate('within').populate('assignTo');

    for (i = 0; i < volu.length; i++) {
      let code = printf('%06d', volu[i].assignTo[0].id);
      await Flagbag.update(volu[i].assignTo[0].id).set({

        bagStatus: '已派發',
        bagNumber: code,
        codePrintedTime: volu[i].assignTo[0].updatedAt,
        isCodePrinted: true,

      }).fetch();

    }

    var updatedVolu = await Volunteer.find(vol.contain.map(v => v.id)).populate('within').populate('assignTo');

    return res.view('volunteer/printLabels', { volunteer: vol, 'qrcode': qrcode, station: updatedVolu });
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

