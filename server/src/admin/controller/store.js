const Base = require('./base.js');
const db = require('../../common/config/database');
const tools=require('../../common/utils/tools.js');
module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const name = this.get('name') || '';

    const model = this.model('store_enter');
    const data = await model.field(['*']).where({
      'title': ['like', `%${name}%`]
    }).page(page, size).countSelect();

    return this.success(data);
  }
  async indexDetailAction() {
    const store_enter_id = this.get('store_enter_id');

    const model = this.model('vw_store_enter_detail');
    const data = await model.field(['*']).where({
      'store_enter_id': store_enter_id
    }).select();
    // const data = await model.field(['yc_goods.name as goods_name','yc_store_enter_detail.*']).join('yc_goods ON yc_store_enter_detail.goods_id=yc_goods.id').order(['yc_store_enter_detail.id DESC'])select();

    console.log(data);
    return this.success(data);
  }
  async EnterSaleAction() {
    const store_enter_detail_id = this.get('id');
    // const store_enter_id=this.get('store_enter_id');
    // const store_house_id=this.get('store_house_id');
    // const brand_id=this.get('brand_id');
    // const product_id=this.get('product_id');
    // const goods_id=this.get('goods_id');
    const enter_number = this.get('enter_number');

    // const uuid= await this.model('store_enter_sale').query('select UUID_SHORT() as uuid');
    // var uuid_short=uuid[0].uuid;
    const model = this.model('store_sale');
    var query = 'select count(1) as count from ' + model.tablePrefix + 'store_sale where store_enter_detail_id=' + store_enter_detail_id;
    var count = await model.query(query);
    count = count[0].count;
    if (count > 0)
      return this.success(null);
    for (var i = 0; i < enter_number; i++) {
      var sql = 'insert ' + model.tablePrefix + 'store_sale(id,store_enter_detail_id) values(UUID_SHORT(),' + store_enter_detail_id + ')';
      var insert = model.execute(sql);
    }
    return this.success(null);

  }
  async infoAction() {
    const id = this.get('id');
    const model = this.model('store_enter');
    const data = await model
      .where({
        id: id
      })
      .find();
    const brand = await this.model('brand')
      .field(['*'])
      .select();
    const store_house = await this.model('store_house')
      .field(['*'])
      .select();
    data.allCategory = {
      brand,
      store_house
    };
    return this.success({
      data
    });
  }

  async infoDetailAction() {
    const id = this.get('id');
    const model = this.model('store_enter_detail');
    const data = await model
      .where({
        id: id
      })
      .find();
    const product = await this.model('vw_product')
      .field(['*'])
      .select();
    data.allCategory = {
      product
    };
    return this.success(data);
  }
  async AttributesAction() {
    const brand = await this.model('brand')
      .field(['*'])
      .select();
    const store_house = await this.model('store_house')
      .field(['*'])
      .select();
    return this.success({
      brand,
      store_house
    });
  }

  async GetProductAction() {
    const product = await this.model('vw_product')
      .field(['*'])
      .where({'category_id':1036010,'is_delete':0})
      .select();
    return this.success({
      product
    });
  }

  async storeDetailAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('store_enter_detail');

    values.is_on_sale = values.is_on_sale ? 1 : 0;
    if (id > 0) {
      await model
        .where({
          id: id
        })
        .update(values);
    } else {

      // const uuid = await model.query('select UUID_SHORT() as uuid');
      // var uuid_short = uuid[0].uuid;
      // values.id = uuid_short;

      values.id =['exp','UUID_SHORT()'] ;
      values.enter_time = new Date();
      await model.add(values);
    }
    return this.success(values);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }
    const values = this.post();
    const id = this.post('id');

    const model = this.model('store_enter');

    values.is_on_sale = values.is_on_sale ? 1 : 0;
    if (id > 0) {
      await model
        .where({
          id: id
        })
        .update(values);
    } else {
      // const uuid= await model.query('select UUID_SHORT() as uuid');
      //  var uuid_short=uuid[0].uuid;
      //  values.id=uuid_short;

      values.id = ['exp', 'UUID_SHORT()'];
      // const g_utils = think.service('g_utils', 'admin');      
      // values.no = await g_utils.generateNo();
      values.no = tools.generateNo();

      await model.add(values);
    }
    return this.success(values);
  }

  async destoryAction() {
    const id = this.post('id');
    //  标记删除，商品一般情况下不能真正删除。
    await this.model('store_enter').where({
      id: id
    }).limit(1).delete();
    return this.success();
  }

  async destoryDetailAction() {
    const id = this.post('id');
    //  标记删除，商品一般情况下不能真正删除。
    await this.model('store_enter_detail').where({
      id: id
    }).delete();
    return this.success();
  }
};