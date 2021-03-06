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
  //login and logout
  '/': 'UserController.login',
  'GET /user/login': 'UserController.login',
  'POST /user/login': 'UserController.login',
  'GET /user/logout': 'UserController.logout',

  //Use in WebController
  //View information only

  '/management': 'WebController.management',

  '/viewitem/:id': 'WebController.viewitem',
  'GET /distributeBag': 'StationController.distributeBag',
  'POST /station/distributeBag': 'StationController.distributeBag',

  'GET /collectBag': 'StationController.collectBag',
  'POST /station/collectBag': 'StationController.collectBag',
  '/printReceipt/:id': 'StationController.printReceipt',

  '/stationmgrDisplay/:id': 'WebController.stationmgrDisplay',
  '/station/:id': 'StationController.station',

  //Adding, deleting and updating WebController info
  '/event/adduser ': 'WebController.adduser',
  'POST /user/': 'WebController.adduser',

  '/addevent': 'WebController.addevent',
  'POST /web/': 'WebController.addevent',

  'GET /updateStation/:id': 'StationController.updateStation',
  'PATCH /station/:id': 'StationController.updateStation',

  'GET /updateUser/:id': 'WebController.updateUser',
  'PATCH /user/:id': 'WebController.updateUser',

  '/addflagstn': 'StationController.addflagstn',
  'POST /addflagstn': 'StationController.addflagstn',

  'DELETE /station/:id': 'StationController.removeStation',

  '/adminDisplay': 'WebController.adminDisplay',
  'DELETE /user/:id': 'WebController.removeUser',

  'GET /updateEvent/:id': 'WebController.updateEvent',
  'PATCH /web/:id': 'WebController.updateEvent',

  'DELETE /web/:id': 'WebController.removeEvent',

  '/viewStation/:id': 'StationController.viewStation',

  '/stationmanagement': 'StationController.stationmanagement',
  '/viewAllBags/:id': 'StationController.viewAllBags',
  '/viewSpareBags': 'StationController.viewSpareBags',
  '/viewNotReceived/:id': 'StationController.viewNotReceived',

  '/printSpareQR/:id': 'StationController.printSpareQR',


  //export
  '/export_admin': 'WebController.export_admin',

  //USE in StationController
  //export in StationController
  '/export_station': 'StationController.export_station',
  '/export_thisStation/:id': 'StationController.export_thisStation',
  '/export_statman': 'StationController.export_statman',
  '/export_vIndividual': 'StationController.export_vIndividual',
  '/export_group': 'StationController.export_group',

  // Used in VolunteerController.js
  // Group Item
  '/group/:id': 'VolunteerController.group',
  '/addGroup': 'VolunteerController.addGroup',

  '/viewGroup/:id': 'VolunteerController.viewGroup',

  'POST /volunteer/group': 'VolunteerController.addGroup',
  'GET /updateGroup/:id': 'VolunteerController.updateGroup',

  'PATCH /volunteer/group/:id': 'VolunteerController.updateGroup',
  'DELETE /volunteer/:id': 'VolunteerController.removeVolunteer',

  // Individual Item
  '/individual/:id': 'VolunteerController.individual',
  '/addIndividual': 'VolunteerController.addIndividual',

  'POST /volunteer/individual': 'VolunteerController.addIndividual',
  '/viewIndividual/:id': 'VolunteerController.viewIndividual',

  'GET /updateIndividual/:id': 'VolunteerController.updateIndividual',
  'PATCH /volunteer/individual/:id': 'VolunteerController.updateIndividual',

  'GET /updateGroupVolunteer/:id': 'VolunteerController.updateGroupVolunteer',
  'PATCH /volunteer/updateGroupVolunteer/:id': 'VolunteerController.updateGroupVolunteer',

  '/printQRcode/:id': 'VolunteerController.print',

  'POST /printLabels/:id': 'VolunteerController.printLabels',

  'POST /printGroupQR/:id': 'VolunteerController.printGroupQR',


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

  // Flagbag & web
  'GET /web/comprise': 'WebController.populate_wf',
  'GET /flagbag/:fk/under': 'FlagbagController.populate_fw',

  // Volunteer & Flagbag
  'GET /flagbag/belongTo': 'FlagbagController.populate_fv',
  'GET /volunteer/:fk/assignTo': 'VolunteerController.populate_vf',

  // Station & Flagbag
  'GET /flagbag/bagFor': 'FlagbagController.populate_fs',
  'GET /station/:fk/stationHas': 'StationController.populate_sf',


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
