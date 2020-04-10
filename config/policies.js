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
    eventreport: 'isAdmin',
    qrCode: 'isAdmin',
    stationmgrDisplay: 'isAdmin',
    addflagstn: 'isAdmin',
    station: 'isAdmin',

  },

  StationController: {
    
    stationmanagement: 'isStationmgr',
    collectBag: 'isStationmgr',
    distributeBag: 'isStationmgr',
    
  },

  VolunteerController: {
    group: 'isAdmin',
    addGroup: 'isAdmin',
    individual: 'isAdmin',
    addIndividual: 'isAdmin',
  
  }

  

};
