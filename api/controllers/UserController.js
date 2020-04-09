/* eslint-disable prefer-arrow-callback */
/* eslint-disable eqeqeq */
/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  login: async function (req, res) {

    if (req.method == 'GET') { return res.view('user/login'); }

    if (!req.body.username || !req.body.password) { return res.badRequest(); }

    var user = await User.findOne({ username: req.body.username });

    if (!user) { return res.status(401).send('使用者名稱或密碼不正確'); }

    const match = await sails.bcrypt.compare(req.body.password, user.password);
    if (!match) { return res.status(401).send('使用者名稱或密碼不正確'); }

    req.session.regenerate((err) => {
      if (err) { return res.serverError(err); }

      req.session.userid = user.id;
      req.session.username = req.body.username;
      req.session.password = user.password;
      req.session.role = user.role;

      sails.log('[Session] ', req.session.username, req.session.password);
      sails.log('[Session1]', req.session.role);

      if (req.wantsJSON) {

        if (req.session.role == 'admin') {
          return res.redirect('/management');
        }

        else if (req.session.role == 'stationmgr') {
          return res.redirect('/stationmanagement');
        }

      }

      else {

        if (req.session.role == 'admin') {
          return res.status(200).send('Login successfully on admin');
        }

        else if (req.session.role == 'stationmgr') {
          return res.status(200).send('Login successfully on station');
        }

      }

    });
  },

  logout: async function (req, res) {
    req.session.destroy(function (err) {

      if (err) { return res.serverError(err); }

      return res.status(200).redirect('/');

    });
  },

  //action - populate(fro user and web)
  populate_uw: async function (req, res) {

    var model = await User.findOne(req.params.id).populate('edit');

    if (!model) { return res.notFound(); }

    return res.json(model);

  },
  //action - populate(fro user and station)
  populate_us: async function (req, res) {

    var model = await User.findOne(req.params.id).populate('monitor');

    if (!model) { return res.notFound(); }

    return res.json(model);

  },
};
