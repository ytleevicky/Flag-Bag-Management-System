/**
 * VolunteerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

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

