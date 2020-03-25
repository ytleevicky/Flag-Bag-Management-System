/**
 * VolunteerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    group: async function (req, res) {

        var model = await Web.findOne(req.session.eventid);  // for eventName

        var group = await Web.findOne(req.session.eventid).populate('contain', { where: { vType: 'group' } });

        console.log(group);
        // console.log(group.contain[0].id); 

        // var abc = await Volunteer.findOne(66).populate('within')

        // var json = JSON.parse(JSON.stringify(abc.within));
        // var show = json[0].sName;    
        // console.log(show);

        return res.view('volunteer/group', { name: model.eventName, stations: group.contain, webs: model, eventid: req.session.eventid });

    },

    addGroup: async function (req, res) {

        if (req.method == 'GET') {

            var web = await Web.findOne(req.session.eventid);

            var stationList = await Web.findOne(req.session.eventid).populate('include');

            return res.view('volunteer/addGroup', { eventid: req.session.eventid, name: web.eventName, stations: stationList.include });
        }

        var group = await Volunteer.create(req.body.Volunteer).fetch();

        await Volunteer.addToCollection(group.id, 'in').members(req.session.eventid);      // Add a Volunteer to that particular event 

        var station = req.body.Station.sName;

        var stat = await Station.find({ where: { sName: station } });
        var json = JSON.parse(JSON.stringify(stat));
        var stationid = json[0].id;     // To get the stationid 

        await Volunteer.addToCollection(group.id, 'within').members(stationid);   // Add volunteer to that particular station

        return res.redirect('/group/' + req.session.eventid);

    },


    updateGroup: async function (req, res) {

        if (req.method == 'GET') {

            // var models = await Web.findOne(req.session.eventid).populate('contain', { where: { vType: 'group'}});

            var models = await Volunteer.findOne(req.params.id).populate('within');
            console.log(req.params.id);

            if (!models) { return res.notFound(); }

            var web = await Web.findOne(req.session.eventid);

            var stationList = await Web.findOne(req.session.eventid).populate('include');

            return res.view('volunteer/updateGroup', { groups: models, eventid: req.session.eventid, name: web.eventName, stations: stationList.include });

        }

        else {
            if (!req.body.Volunteer) { return res.badRequest('Form-data not received.'); }

            var models = await Volunteer.update(req.params.id).set({
                vGroupName: req.body.Volunteer.vGroupName,
                vGroupAddress: req.body.Volunteer.vGroupAddress,
                // sName: req.body.Station.sName,
                vName: req.body.Volunteer.vName,
                vContact: req.body.Volunteer.vContact
            }).fetch();

            if (models.length == 0) { return res.notFound(); }

            if (req.wantsJSON) {
                return res.json({ message: '已更新團體！', url: '/group/' + req.session.eventid });
            }
            else {
                return res.redirect('/group/' + req.session.eventid);
            }
        }
    },

    individual: async function (req, res) {

        var model = await Web.findOne(req.session.eventid);     // for eventName
    
        var individual = await Web.findOne(req.session.eventid).populate('contain', { where: { vType: 'individual' }});
    
        return res.view('volunteer/individual', { name: model.eventName, stations: individual.contain, webs: model, eventid: req.session.eventid });
    
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


};

