const Base = require("./base.js");
const fs = require("fs");
const _ = require("lodash");
const tools = require("../../common/utils/tools.js");

module.exports = class extends Base {
  // async infoAction() {
  //   const saleInfo = await this.model("sale")
  //     .where({
  //       id: think.userId
  //     })
  //     .find();
  //   return this.success({
  //     saleInfo: saleInfo
  //   });
  // }

  /**
   * 增加车上订单
   */
  async addAction() {
    const userInfo = this.post("userInfo");
    const saleInfo = this.post("saleInfo");
    const storeList = this.post("storeList");
    const order_taxi = this.post("order_taxi");
    const order_sn = tools.generateNo();
    order_taxi.order_sn = order_sn;
    const order_taxi_id = await this.model("order_taxi").add(order_taxi);

    var detail_list = [];
    if (order_taxi_id > 0) {
      for (var i = 0; i < storeList.length; i++) {
        var order_taxi_detail = storeList[i];
        // delete sale_order_detail.id;
        order_taxi_detail.id = ["exp", "UUID_SHORT()"];
        order_taxi_detail.user_id = userInfo.id;
        order_taxi_detail.sale_id = saleInfo.id;
        order_taxi_detail.order_taxi_id = order_taxi_id;
        order_taxi_detail.number = order_taxi_detail.check_number;
        detail_list.push(order_taxi_detail);
      }
      const order_taxi_detail_id = await this.model(
        "order_taxi_detail"
      ).addMany(detail_list);
    } else
      return this.fail('插入订单失败');
    order_taxi.id = order_taxi_id;
    return await this.prepay(order_taxi, userInfo.openid);
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
          total_fee: think.config('weixin.pay_test') ? 1 : parseInt(orderInfo.order_price * 100),
          spbill_create_ip: '' //g_mod
        }, 2 //是车上订单
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
    if (await this.model('order_taxi').where({
        id: id
      }).update({
        order_status: 1,
        pay_time: ['exp', 'current_timestamp()']
      })) {
      return this.success(id);
    } else {
      return this.fail('更新订单状态失败  ');
    }
  }

  async cancelAction() {
    let id = this.get('id');
    let model = this.model('order_taxi_detail');
    try {
    //   await model.startTrans();
    //   let detail = await model.where({
    //     order_taxi_id: id
    //   }).delete;
    //   let order = await this.model('order_taxi').where({
    //     id: id
    //   }).delete;
    //   await model.commit();
    let detail = await model.where({
      order_taxi_id: id
    }).delete();
    let order = await this.model('order_taxi').where({
      id: id
    }).delete();
      return this.success('删除订单成功'+ id);
    } catch (e) {
      // await model.rollback();
      return this.fail('删除订单失败'+ id);
    }
    // if (await this.model('order_taxi').where({
    //     id: id
    //   }).update({
    //     order_status: 1,
    //     pay_time: ['exp', 'current_timestamp()']
    //   })) {
    //   return this.success(id);
    // } else {
    //   return this.fail('更新订单状态失败  ');
    // }
  }
  async listAction() {
    const orderList = await this.model('vw_order_taxi').where({
      user_id: think.userId
    }).select();
    return this.success({
      orderList: orderList
    });
  }

  async detailListAction() {
    let order_id = this.get('id');
    const detailList = await this.model('vw_order_taxi_detail').where({
      order_taxi_id: order_id
    }).select();
    return this.success({
      detailList: detailList
    });
  }
};