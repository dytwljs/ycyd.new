const Base = require("./base.js");
const fs = require("fs");
const _ = require("lodash");
const tools = require("../../common/utils/tools.js");

module.exports = class extends Base {
  async infoAction() {
    const saleInfo = await this.model("sale")
      .where({
        id: think.userId
      })
      .find();
    return this.success({
      saleInfo: saleInfo
    });
  }

  /**
   * 增加销售订单
   */
  async addAction() {
    const userInfo = this.post("userInfo");
    const storeList = this.post("storeList");
    const sale_order = this.post("sale_order");
    const order_sn = tools.generateNo();
    sale_order.order_sn = order_sn;
    const sale_order_id = await this.model("sale_order").add(sale_order);

    var detail_list = [];
    if (sale_order_id > 0) {
      for (var i = 0; i < storeList.length; i++) {
        var sale_order_detail = storeList[i];
        // delete sale_order_detail.id;
        sale_order_detail.id = ["exp", "UUID_SHORT()"];
        sale_order_detail.sale_id = userInfo.id;
        sale_order_detail.sale_order_id = sale_order_id;
        sale_order_detail.number = sale_order_detail.check_number;
        detail_list.push(sale_order_detail);
      }
      const sale_order_detail_id = await this.model(
        "sale_order_detail"
      ).addMany(detail_list);
    } else
      return this.fail('插入订单失败');
    sale_order.id = sale_order_id;
    return await this.prepay(sale_order, userInfo.openid);
  }

  /**
   * 获取支付的请求参数
   * @returns {Promise<PreventPromise|void|Promise>}
   */
  async prepay(orderInfo, openid) {
    // const openid = await this.model('user').where({ id: orderInfo.user_id }).getField('openid', true);
    // if (think.isEmpty(openid)) {
    //   return this.fail('微信支付失败');
    // }
    const WeixinSerivce = this.service('weixin', 'api');
    try {
      const returnParams = await WeixinSerivce.createUnifiedOrder({
          openid: openid,
          body: '订单编号：' + orderInfo.order_sn,
          out_trade_no: orderInfo.order_sn,
          total_fee:think.config('weixin.pay_test') ?1: parseInt(orderInfo.order_price * 100),
          spbill_create_ip: '' //g_mod
        }, 1 //是销售订单
      );

      return this.success({
        payParam: returnParams,
        orderInfo: orderInfo
      });
      // return this.success(returnParams);
    } catch (err) {
      // return this.fail('微信支付失败');
      return this.fail(err);
    }
  }
  async statusAction() {
    let id = this.get('id');
    if (await this.model('sale_order').where({
        id: id
      }).update({
        order_status: 1
        ,pay_time:['exp','current_timestamp()']
      })) {
      return this.success(id);
    } else {
      return this.fail('更新订单状态失败  ');
    }
  }
};