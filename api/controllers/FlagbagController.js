/**
 * FlagbagController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {



    //action - populate(for flagbag and web)
    populate_fw: async function (req, res) {

        var model = await Volunteer.findOne(req.params.id).populate('under');

        if (!model) { return res.notFound(); }

        return res.json(model);

    },


};

