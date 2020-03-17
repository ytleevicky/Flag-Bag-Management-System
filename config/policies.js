/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  WebController: {
    management: 'isAdmin',
    viewitem: 'isAdmin',
    adminDisplay: 'isAdmin',
    viewitem: 'isAdmin',
    adduser: 'isAdmin',
    updateUser: 'isAdmin',
    adduser: 'isAdmin',
    addIndividual: 'isAdmin',
    addGroup: 'isAdmin',
    eventreport: 'isAdmin',
    qrCode: 'isAdmin',
    collectBag: 'isStationmgr',
    distributeBag: 'isStationmgr',

  },

  StationController: {
    stationmgrDisplay: 'isAdmin',
    individual: 'isAdmin',
    group: 'isAdmin',
    station: 'isAdmin',
    addflagstn: 'isAdmin',
    stationmanagement: 'isStationmgr',

  }

  

};
