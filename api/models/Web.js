/**
 * Web.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    //E = event, S = station, V = voluteer
    //活動名稱
    eventName: {      //use in eventdetail.ejs, management.ejs
      type: 'string'
    },
    //活動日期
    dateOfEvent: {      //use in eventdetail.ejs, management.ejs
      type: 'string'
    },
    //賣旗地點
    eventLocation: {      //use in eventdetail.ejs
      type: 'string'
    },

    QRCodePrinted:{   //use in individual.ejs
      type: 'boolean'
    },

    data_timestamp: {
      type: 'string'
    },

    //義工人數
    // numOfV:{      //use in eventdetail.ejs
    //   type: 'number'
    // },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    superviseBy: {
      collection: 'User',
      via: 'edit'
    },

    include: {
      collection: 'Station',
      via: 'inside'
    },

    contain: {
      collection: 'Volunteer',
      via: 'in'
    },

    comprise: {
      collection: 'Flagbag',
      via: 'under'
    }

  },

};

