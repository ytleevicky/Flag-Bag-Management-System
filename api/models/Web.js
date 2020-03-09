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

    vName:{    //use in individual.ejs
      type: 'string'
    },
    //賣旗團體名
    vGroupName:{    //use in individual.ejs, group.ejs
      type: 'string'
    },
    //旗站位置
    sLocation:{     //use in individual.ejs, station.ejs, group.ejs
      type: 'string'
    },
    //旗袋編號
    bagNumber:{     //use in individual.ejs
      type: 'string'
    },
    //旗袋狀態
    bagStats:{      //use in individual.ejs
      type: 'string'
    },
    //旗袋最後更新時間
    bagUpdate:{     //use in individual.ejs
      type: 'string'
    },
    //最後列印標籤時間
    codePrinted:{   //use in individual.ejs
      type: 'string'
    },
    //賣旗地區
    location:{      //use in group.ejs, station.ejs
      type: 'string'
    },
    //義工人數
    numOfV:{      //use in group.ejs  
      type: 'number'
    },
    //旗袋總數(for each station in each event)
    numOfBag:{      //use in station.ejs
      type: 'number'
    },
    //後備旗袋
    numOfBagBackUp:{      //use in station.ejs
      type: 'number'
    },


    //E = event, S = station, V = voluteer
    //活動名稱
    eventName:{      //use in eventdetail.ejs
      type: 'string'
    },
    //活動日期
    dateOfEvent:{      //use in eventdetail.ejs
      type: 'string'
    },
    //賣旗地點
    eventLocation:{      //use in eventdetail.ejs
      type: 'string'
    },
    //旗站數目
    numOfStation:{      //use in eventdetail.ejs
      type: 'number'
    },
    //旗袋總數(for each event)
    numOfEBag:{      //use in eventdetail.ejs
      type: 'number'
    },
    //站長人數
    numOfSuser:{      //use in eventdetail.ejs
      type: 'number'
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
  },

};

