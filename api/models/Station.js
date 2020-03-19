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

    //是否列印標籤
    codePrinted: {   //use in individual.ejs
      type: 'boolean'
    },
    //最後列印標籤時間
    codePrintedTime: {   //use in individual.ejs
      type: 'String'
    },

    // numOfSBag: {      //use in eventdetail.ejs
    //   type: 'number'
    // },

    numOfSpareBag: {      //use in eventdetail.ejs
      type: 'number'
    },

    isSpareBag: {   //use in individual.ejs
      type: 'boolean'
    },

    // isDeleted:{   //use in individual.ejs
    //   type: 'boolean',
    //   // required: true
    // },

    vContacterName: {
      type: 'string'
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

    createdby:{
      type: 'string',
      // required: true
    },

    numOfVolunteer: {
      type: 'number',
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
    }

  },

};

