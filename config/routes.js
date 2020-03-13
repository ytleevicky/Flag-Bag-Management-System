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
  
  //Use in UserController

  '/': 'UserController.login',                //default page
  //login and logout
  'GET /user/login': 'UserController.login',
  'POST /user/login': 'UserController.login',
  'GET /user/logout': 'UserController.logout',

  //Use in WebController

  '/location': 'WebController.location',
  '/setting': 'WebController.setting',
  '/contact': 'WebController.contact',
  '/management': 'WebController.management',
  '/eventdetail': 'WebController.eventdetail',
  '/viewitem': 'WebController.viewitem',
  '/personalitem': 'WebController.personalitem',
  '/groupitem': 'WebController.groupitem',
  '/eventreport': 'WebController.eventreport',
  '/groupandindividual': 'WebController.groupandindividual',
  //Adding pages
  '/addflagstn': 'WebController.addflagstn',
  '/adduser': 'WebController.adduser',
  'POST /user/': 'WebController.adduser',
  '/addadmin': 'WebController.addadmin',
  '/addGroup': 'WebController.addGroup',
  '/addevent': 'WebController.addevent',

  '/adminDisplay': 'WebController.adminDisplay',

  '/stationmanagement': 'WebController.stationmanagement',
  '/individual': 'WebController.individual',
  '/group': 'WebController.group',
  '/addIndividual': 'WebController.addIndividual',

  '/qrCode': 'WebController.qrCode',
  '/generateLabel': 'WebController.generateLabel',
  //import and export
  '/import_user': 'WebController.import_user',
  '/export_admin': 'WebController.export_admin',
  '/export_statman': 'WebController.export_statman',
  '/import_event': 'WebController.import_event',
  '/export_event': 'WebController.export_event',
  '/export_group': 'WebController.export_group',

  
  'GET /updateUser/:id': 'WebController.updateUser',
  'POST /user/:id': 'WebController.updateUser',

  //USe in StationController

  '/stationmgrDisplay': 'StationController.stationmgrDisplay',
  '/station': 'StationController.station',
  //export
  '/export_station': 'StationController.export_station',

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
