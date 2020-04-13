/**
 * Station.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //旗站名稱
    sName: {
      type: 'String'
    },

    // 後備旗袋
    numOfSpareBag: {      //use in eventdetail.ejs
      type: 'number'
    },

    //旗站位置
    sLocation: {     //use in individual.ejs, station.ejs, group.ejs
      type: 'string'
    },

    createdby: {
      type: 'string'
    },

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    inside: {
      collection: 'Web',
      via: 'include'
    },

    monitorBy: {
      collection: 'User',
      via: 'monitor'
    },

    has: {
      collection: 'Volunteer',
      via: 'within'
    },

    stationHas: {
      collection: 'Flagbag',
      via: 'bagFor'
    }

  },

};

