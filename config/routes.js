/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/distribution': 'WebController.distribution',
  '/location': 'WebController.location',
  '/collection': 'WebController.collection',
  '/setting': 'WebController.setting',
  '/contact': 'WebController.contact',
  '/management': 'WebController.management',
  '/eventdetail': 'WebController.eventdetail',
  '/addflagstn': 'WebController.addflagstn',
  '/station': 'WebController.station',
  '/viewitem': 'WebController.viewitem',
  '/personalitem': 'WebController.personalitem',
  '/groupitem': 'WebController.groupitem',
  '/adduser': 'WebController.adduser',
  '/stationmanagement': 'WebController.stationmanagement',
  '/individual': 'WebController.individual',
  '/group': 'WebController.group',
  '/addIndividual': 'WebController.addIndividual',
  '/addGroup': 'WebController.addGroup',

  'GET /': 'UserController.login',
  'POST /': 'UserController.login',
  'POST /user/logout': 'UserController.logout'

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
