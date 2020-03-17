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
    // eslint-disable-next-line eqeqeq
    if (req.method == 'GET') { return res.view('user/login'); }

    if (!req.body.username || !req.body.password) { return res.badRequest(); }

    var user = await User.findOne({ username: req.body.username });

    if (!user) { return res.status(401).send('使用者名稱或密碼不正確'); }


    // eslint-disable-next-line eqeqeq
    // if (user.password != req.body.password)
    // {return res.status(401).send('Wrong Password');}
    const match = await sails.bcrypt.compare(req.body.password, user.password);
    if (!match) { return res.status(401).send('使用者名稱或密碼不正確'); }

    req.session.regenerate((err) => {
      if (err) { return res.serverError(err); }

      req.session.username = req.body.username;
      req.session.password = user.password;
      req.session.role = user.role;

      sails.log('[Session] ', req.session.username, req.session.password);
      sails.log('[Session1]', req.session.role);

      // eslint-disable-next-line eqeqeq
      if (req.session.role == 'admin') {
        if (req.wantsJSON) {
          return res.redirect('/management');
        } 
      }

      else if (req.session.role == 'stationmgr') {
        if (req.wantsJSON) {
          return res.redirect('/stationmanagement');
        }
      }

    });
  },

  logout: async function (req, res) {
    req.session.destroy(function (err) {

      if (err) { return res.serverError(err); }

      return res.redirect('/');

    });
  },

  //action - populate
  populate: async function (req, res) {

    var model = await User.findOne(req.params.id).populate("supervises");

    if (!model) return res.notFound();

    return res.json(model);

},
};
