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
    updateUser: 'isAdmin',
    adduser: 'isAdmin',
    addIndividual: 'isAdmin',
    eventreport: 'isAdmin',
    qrCode: 'isAdmin',
    collectBag: 'isStationmgr',
    distributeBag: 'isStationmgr',
    stationmgrDisplay: 'isAdmin',
    addflagstn: 'isAdmin',
    station: 'isAdmin',

  },

  StationController: {
    individual: 'isAdmin',
    group: 'isAdmin',
    stationmanagement: 'isStationmgr',
    addGroup: 'isAdmin',

  }

  

};
