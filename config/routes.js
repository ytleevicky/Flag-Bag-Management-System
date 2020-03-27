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
  '/management': 'WebController.management',
  // '/eventdetail/:id': 'WebController.eventdetail',
  '/viewitem/:id': 'WebController.viewitem',
  '/distributeBag': 'WebController.distributeBag',
  '/collectBag': 'WebController.collectBag',
  '/eventreport': 'WebController.eventreport',
  '/groupandindividual': 'WebController.groupandindividual',
  //Adding pages
  '/event/adduser ': 'WebController.adduser',
  'POST /user/': 'WebController.adduser',

  '/addevent': 'WebController.addevent',
  'POST /web/': 'WebController.addevent',

  '/adminDisplay': 'WebController.adminDisplay',
  'DELETE /user/:id': 'WebController.removeUser',

  '/qrCode': 'WebController.qrCode',
  '/generateLabel': 'WebController.generateLabel',
  //import and export
  '/import_user': 'WebController.import_user',
  '/export_admin': 'WebController.export_admin',
  // '/import_event': 'WebController.import_event',
  // '/export_event': 'WebController.export_event',
  // '/export_group': 'WebController.export_group',
  'GET /updateUser/:id': 'WebController.updateUser',
  'GET /updateStation/:id': 'WebController.updateStation',

  'PATCH /user/:id': 'WebController.updateUser',
  'PATCH /station/:id': 'WebController.updateStation',

  //USE in StationController

  '/stationmgrDisplay/:id': 'WebController.stationmgrDisplay',
  '/station/:id': 'WebController.station',
  '/stationmanagement': 'StationController.stationmanagement',
  
  '/addflagstn': 'WebController.addflagstn',

  'DELETE /station/:id': 'WebController.removeStation',


  // 'GET /updateIndividual/:id': 'StationController.updateIndividual',
  // 'PATCH /station/individual/:id': 'StationController.updateIndividual',


  // Used in VolunteerController.js
  '/group/:id': 'VolunteerController.group',

  '/addGroup': 'VolunteerController.addGroup',
  'POST /volunteer/group': 'VolunteerController.addGroup',

  'GET /updateGroup/:id': 'VolunteerController.updateGroup',
  'PATCH /volunteer/group/:id': 'VolunteerController.updateGroup',

  'DELETE /volunteer/:id': 'VolunteerController.removeVolunteer',

  '/individual/:id': 'VolunteerController.individual',

  '/addIndividual': 'VolunteerController.addIndividual',
  'POST /volunteer/individual': 'VolunteerController.addIndividual',

  '/viewIndividual/:id': 'VolunteerController.viewIndividual',


  //export
  '/export_station': 'StationController.export_station',
  '/export_statman': 'StationController.export_statman',
  '/export_vIndividual': 'StationController.export_vIndividual',
  '/export_group': 'StationController.export_group',

  // import
  '/import_station': 'StationController.import_station',
  '/import_vIndividual': 'StationController.import_vIndividual',
  '/import_group': 'StationController.import_group',


  //For populate
  //user and web
  'GET /user/edit': 'UserController.populate_uw',
  'GET /event/:fk/superviseBy': 'WebController.populate_wu',
  //web and station
  'GET /station/inside': 'StationController.populate_sw',
  'GET /web/:fk/include': 'WebController.populate_ws',

  // Station & User
  'GET /user/monitor': 'UserController.populate_us',
  'GET /station/:fk/monitorBy': 'StationController.populate_su',


  // Volunteer & Station
  'GET /station/:fk/has': 'StationController.populate_sv',
  'GET /volunteer/:fk/within': 'VolunteerController.populate_vs',

  // Volunteer & web
  'GET /web/contain': 'WebController.populate_wv',
  'GET /volunteer/:fk/in': 'VolunteerController.populate_vw',


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
