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

            // var event = await Web.findOne(req.params.id);
            var models = await Station.findOne(req.params.id).populate('inside');

            if (!models) { return res.notFound(); }

            if (!req.session.eventid) {
                if (req.method == 'GET') { return res.view('station/updateGroup', { stations: models, eventid: '' }); }
            }
            else {
                var web = await Web.findOne(req.session.eventid);
                return res.view('volunteer/updateGroup', { stations: models, eventid: req.session.eventid, name: web.eventName });
            }
        }

        else {
            if (!req.body.Station) { return res.badRequest('Form-data not received.'); }

            var models = await Station.update(req.params.id).set({
                vGroupName: req.body.Station.vGroupName,
                sLocation: req.body.Station.sLocation,
                sName: req.body.Station.sName,
                vContacterName: req.body.Station.vContacterName,
                vContact: req.body.Station.vContact
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

