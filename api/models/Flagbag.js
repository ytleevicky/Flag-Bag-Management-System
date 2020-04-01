/**
 * Flagbag.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    // 是否後備旗袋
    isSpareBag: {
      type: 'boolean'
    }, 

    // 是否已刪除
    isDeleted: {
      type: 'boolean'
    }, 

    // 旗袋號碼
    bagNumber: {
      type: 'string'
    }, 

    // 旗袋狀態  （e.g. is the flag bag returned? ）
    bagStatus: {
      type: 'string'
    },

    // bagUpdate: {
    //   type: 'string'
    // },

    // 是否已列印 QR Code
    isCodePrinted: {
      type: 'boolean'
    },

    // QR Code 列印時間
    codePrintedTime: {
      type: 'string'
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

