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

  location: async function (req, res) {

    var models = await Web.find();
    return res.view('web/location', { webs: models });

  },

  collection: async function (req, res) {

    var models = await Web.find();
    return res.view('web/collection', { webs: models });

  },

  setting: async function (req, res) {

    var models = await Web.find();
    return res.view('web/setting', { webs: models });

  },

  contact: async function (req, res) {

    var models = await Web.find();
    return res.view('web/contact', { webs: models });

  },

  distribution: async function (req, res) {

    var models = await Web.find();
    return res.view('web/distribution', { webs: models });

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

  station: async function (req, res) {

    var models = await Web.find();
    return res.view('web/station', { webs: models });

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

    var models = await Web.find();
    return res.view('web/adduser', { webs: models });

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

};

