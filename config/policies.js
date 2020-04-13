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
    updateUser: 'isAdmin',
    adduser: 'isAdmin',
    stationmgrDisplay: 'isAdmin',
    addflagstn: 'isAdmin',
    station: 'isAdmin',
    addevent: 'isAdmin',
    viewStation: 'isAdmin',
    updateEvent: 'isAdmin',
    removeEvent: 'isAdmin',
    updateStation: 'isAdmin',
    removeUser: 'isAdmin', 
    removeStation: 'isAdmin',

  },

  StationController: {

    stationmanagement: 'isStationmgr',
    collectBag: 'isStationmgr',
    distributeBag: 'isStationmgr',
    viewAllBags: 'isStationmgr',
    printReceipt: 'isStationmgr',

  },

  VolunteerController: {
    group: 'isAdmin',
    addGroup: 'isAdmin',
    viewGroup: 'isAdmin',
    updateGroup: 'isAdmin',
    removeVolunteer: 'isAdmin',
    individual: 'isAdmin',
    addIndividual: 'isAdmin',
    viewIndividual: 'isAdmin',
    updateIndividual: 'isAdmin',
    print: 'isAdmin',
    printLabels: 'isAdmin',

  }



};
