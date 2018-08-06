const Base = require('./base.js');
const fs = require('fs');
const _ = require('lodash');
const createQr=require('../../common/utils/createQr.js');

module.exports = class extends Base {
  async infoAction() {
    const saleInfo = await this.model('sale').where({
      id: think.userId
    }).find();
    return this.success({saleInfo:saleInfo});
  }

  async getAction() {
    var mobile = this.get('mobile');
    const saleInfo = await this.model('sale').where({
      mobile: mobile
    }).find();
    return this.success({saleInfo:saleInfo});
  }
  /**
   * 保存用户头像
   * @returns {Promise.<void>}
   */
  // async saveAvatarAction() {
  //   const avatar = this.file('avatar');
  //   if (think.isEmpty(avatar)) {
  //     return this.fail('保存失败');
  //   }

  //   const avatarPath = think.RESOURCE_PATH + '/static/sale/avatar/1.' + _.last(_.split(avatar.path, '.'));

  //   fs.rename(avatar.path, avatarPath, function (res) {
  //     return this.success();
  //   });
  // }
};