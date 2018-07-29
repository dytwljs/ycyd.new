const Base = require('./base.js');

module.exports = class extends Base {

  async ListAction(store_house_id) {
    return await this.getList(null, null);
  }
  async getList(store_house_id, sale_id) {
    var storeList = null;
    if (think.isEmpty( store_house_id))
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
  /**
   * 获取对应司机入库表中的数据
   * @returns {Promise.<{cartList: *, cartTotal: {goodsCount: number, goodsAmount: number, checkedGoodsCount: number, checkedGoodsAmount: number}}>}
   */
  async getStoreSale(id) {
    // const storeSale = await this.model('store_sale').select();
    const storeSale = await this.model('vw_store_sale').where({
      id: id
    }).select();
    // const storeSale = await this.model('store_sale').field(['CAST(id as CHAR) as id','sale_id']).where({id: id}).select();
    // if(storeSale.count==0)
    const sale_id = storeSale[0].sale_id;
    const saleInfo = await this.model('sale').where({
      id: sale_id
    }).select();
    storeSale[0].sale_name = saleInfo[0].name;
    // const storeList=await this.model('vw_store_sale').field(['*','CAST(id as CHAR) as id1']).where({sale_id: sale_id}).select();
    const storeList = await this.model('vw_store_sale').where({
      sale_id: sale_id
    }).select();

    return {
      storeList: storeList,
      storeSale: storeSale
    };
  }
  async eanAction() {
    let ean_code = this.post('ean_code');
    return this.success(null);
  }
  /**
   * 获取购物车信息，所有对购物车的增删改操作，都要重新返回购物车的信息
   * @return {Promise} []
   */
  async indexAction() {

    // let id = this.post('id');
    // return this.success(await this.getStoreSale(id));

    return await this.getList(null, null);
  }
};