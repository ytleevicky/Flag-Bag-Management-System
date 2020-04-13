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
    stationmgrDisplay: 'isAdmin',
    updateUser: 'isAdmin',
    adduser: 'isAdmin',
    removeUser: 'isAdmin', 
    addevent: 'isAdmin',
    updateEvent: 'isAdmin',
    removeEvent: 'isAdmin',

  },

  StationController: {

    stationmanagement: 'isStationmgr',
    collectBag: 'isStationmgr',
    distributeBag: 'isStationmgr',
    viewAllBags: 'isStationmgr',
    printReceipt: 'isStationmgr',

    station: 'isAdmin',
    addflagstn: 'isAdmin',
    viewStation: 'isAdmin',
    updateStation: 'isAdmin',
    removeStation: 'isAdmin',

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
