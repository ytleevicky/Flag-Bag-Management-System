/**
 * Volunteer.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    vName: {    //use in individual.ejs
      type: 'string'
    },

    //賣旗團體名
    vGroupName: {    //use in individual.ejs, group.ejs
      type: 'string'
    },

    vGroupAddress: {
      type: 'string'
    },

    vType: {     //use in individual.ejs
      type: 'string'
    },

    vContact: {    //use in individual.ejs, group.ejs
      type: 'string'
    },

    isContacter: {    //use in individual.ejs, group.ejs
      type: 'boolean'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    within: {
      collection: 'Station',
      via: 'has'
    },

    in: {
      collection: 'Web',
      via: 'contain'
    },

    assignTo: {
      collection: 'Flagbag',
      via: 'belongTo'
    },

  },

};

