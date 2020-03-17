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

    /*orgName: {
      type: 'string'
    },

    location:{
      type: 'string'
    },

    resName: {
      type: 'string'
    },

    resNo: {
      type: 'number'
    },

    attendPpl: {
      type: 'number',
      required: true
    },

    numofBag: {
      type: 'number',
      required: true
    },

    confirmed: {
      type: 'string'
    },

    numofBagCollect: {
      type: 'number'
    },*/

    //v/V = voluteer, s = station
    //賣旗者姓名
    // generated_timestamp: {
    //   type: 'string'
    // },

    //義工人數
    numOfV: {      //use in group.ejs, addevent.ejs
      type: 'number'
    },
    //旗袋總數(for each station in each event)
    numOfBag: {      //use in station.ejs
      type: 'number'
    },
    //後備旗袋
    numOfBagBackUp: {      //use in station.ejs
      type: 'number'
    },


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
    //旗站數目
    numOfStation: {      //use in eventdetail.ejs, addevent.ejs
      type: 'number'
    },
    //旗袋總數(for each event)
    numOfEBag: {      //use in eventdetail.ejs, addevent.ejs
      type: 'number'
    },

    QRCodePrinted:{   //use in individual.ejs
      type: 'boolean'
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
      collection: 'Web',
      via: 'edit'
    },
  },

};

