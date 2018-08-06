const Base = require('./base.js');

module.exports = class extends Base {

  // async ListAction(store_house_id) {
  //   return await this.getList(null, null);
  // }
  async getList(store_house_id, sale_id) {
    var storeList = null;
    if (think.isEmpty(store_house_id))
      storeList = await this.model('vw_store_pile').select();
    else
      storeList = await this.model('vw_store_pile').where({
        store_house_id: store_house_id
      }).select();
    // const storeSale=await this.model('vw_store_pile_sale').where({
    //   sale_id: sale_id
    // }).select();
    const storeSale = await this.model('vw_store_pile_sale').select();
    return this.success({
      storeList: storeList,
      storeSale: storeSale
    });
  }


  /**   暂未使用
   * 客户端根据二维码 获取对应司机，入库表中的数据
   * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
   */
  async getStoreSaleByCode(mobile) {
    return this.fail('code');
  }
  /**
   * 客户端根据司机手机号 获取对应司机入库表中的数据
   * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
   */
  async getStoreSaleByMobile(mobile) {
    const storeList = await this.model('vw_store_pile_sale').where({
      mobile: mobile
    }).select();
    const saleInfo = await this.model('vw_sale').where({
      mobile: mobile
    }).find();
    return this.success({
      storeList: storeList,
      saleInfo: saleInfo
    });
  }
  /**
   * 司机端获取对应司机入库表中的数据
   * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
   */
  async getStoreSale() {
    const storeList = await this.model('vw_store_pile_sale').where({
      sale_id: think.userId
    }).select();
    // const saleInfo = await this.model('sale').where({
    //   id: think.userId
    // }).find();
    const orderList=await this.model('vw_order_taxi').where({
      sale_id: think.userId
    }).order('id desc').limit(10).select();
    return this.success({
      storeList: storeList
      ,orderList:orderList
      // ,saleInfo:saleInfo
    });
  }
  async eanAction() {
    let ean_code = this.post('ean_code');
    return this.success(null);
  }

  /**
   * 获取司机库存
   * @return {Promise} []
   */
  async saleAction() {

    // let mobile = this.get('mobile');
    let scene = this.get('scene');
    let scene_type = this.get('scene_type');
    // return this.success(await this.getStoreSale(id));
    if(scene_type=='sal')
      return await this.getStoreSaleByMobile(scene);
    else if(scene_type=='cod')
      return await this.getStoreSaleByCode(scene);
    else
      return this.fail('');
  }

  async selfAction() {
    return await this.getStoreSale();
  }
  /**
   * 获取仓库库存列表
   * @return {Promise} []
   */
  async indexAction() {

    // let id = this.post('id');
    // return this.success(await this.getStoreSale(id));

    return await this.getList(null, null);
  }
};