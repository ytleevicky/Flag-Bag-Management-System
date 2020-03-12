/**
 * Station.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    sName: {
      type: 'String'
    },

    //最後列印標籤時間
    codePrinted:{   //use in individual.ejs
      type: 'boolean'
    },

    codePrintedTime:{   //use in individual.ejs
      type: 'String'
    },

    //站長人數
    numOfSuser: {      //use in eventdetail.ejs
      type: 'number'
    },

    // numOfSBag: {      //use in eventdetail.ejs
    //   type: 'number'
    // },

    numOfSpareBag: {      //use in eventdetail.ejs
      type: 'number'
    },

    isSpareBag:{   //use in individual.ejs
      type: 'boolean'
    },

    isDeleted:{   //use in individual.ejs
      type: 'boolean'
    },

    vName: {    //use in individual.ejs
      type: 'string'
    },

    //賣旗團體名
    vGroupName: {    //use in individual.ejs, group.ejs
      type: 'string'
    },


    vContact: {    //use in individual.ejs, group.ejs
      type: 'string'
    },

    //旗站位置
    sLocation: {     //use in individual.ejs, station.ejs, group.ejs
      type: 'string'
    },

    //旗袋編號
    bagNumber: {     //use in individual.ejs
      type: 'string'
    },

    //旗袋狀態
    bagStatus: {      //use in individual.ejs
      type: 'string'
    },

    //旗袋最後更新時間
    bagUpdate: {     //use in individual.ejs
      type: 'string'
    },

    vType: {     //use in individual.ejs
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

  },

};

