const Base = require('./base.js');
const db = require('../../common/config/database.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const name = this.get('name') || '';
    // console.log(db.prefix);
    // console.log('...........');
    const model = this.model('goods');
    const data = await model.field(['yc_category.name as category_name','yc_goods.*']).join('yc_category ON yc_goods.category_id=yc_category.id').where({'yc_goods.name': ['like', `%${name}%`],'yc_goods.is_delete':0}).order(['yc_goods.id DESC']).page(page, size).countSelect();
    //var where={db.prefix + 'goods.name'  : ['like', `%${name}%`],db.prefix + 'goods.is_delete' : 0};
    // const data = await model.field([db.prefix + 'category.name as category_name', db.prefix + 'goods.*']).join(db.prefix + 'category ON ' + db.prefix + 'goods.category_id=' + db.prefix + 'category.id')
    //   .where({db.prefix + 'goods.name'  : ['like', `%${name}%`],db.prefix + 'goods.is_delete' : 0})
    //   .order([db.prefix + 'goods.id DESC']).page(page, size).countSelect();

    // const data = await model.field([db.prefix+'category.name as category_name', db.prefix+'goods.*']).join(db.prefix+'category ON '+db.prefix+'goods.category_id='+db.prefix+'category.id').page(page, size).countSelect();

    // var sql ="select nc.`name`,g.* from yc_goods g JOIN yc_category nc ON g.category_id=nc.id where g.`name` like '%%' ORDER BY g.id desc limit "+(page-1)*size+","+size;
    // const data=await model.query(sql);

    // console.log(this.ctx.origin);

    // console.log(data);
    return this.success(data);
  }

  async infoAction() {
    const id = this.get('id');
    const model = this.model('goods');
    const data = await model.where({
      id: id
    }).find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('goods');
    values.is_on_sale = values.is_on_sale ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    values.is_hot = values.is_hot ? 1 : 0;
    var valuesProduct = {
      goods_id: values.id,
      goods_sn: values.goods_sn,
      retail_price: values.retail_price,
      goods_number: values.goods_number
    };
    if (id > 0) {
      await model.where({
        id: id
      }).update(values);
      await this.model('product').where({
        goods_id: id
      }).update(valuesProduct);
    } else {
      //  delete values.id;
      // await model.add(values);
      //  g_mod
      values.id = values.goods_sn >> 0;
      const modelProduct = this.model('product');
      await model.add(values);
      await modelProduct.add(valuesProduct);
    }
    return this.success(values);
  }

  async destoryAction() {
    const id = this.post('id');
    //  标记删除，商品一般情况下不能真正删除。
    await this.model('goods').where({
      id: id
    }).update({
      is_delete: 1
    });
    //  真正删除商品，慎用。
    // await this.model('goods').where({id: id}).limit(1).delete();
    // await this.model('product').where({goods_id: id}).delete();
    // TODO 删除图片

    return this.success();
  }
  async getAllCategoryAction() {
    const model = this.model('category');
    const data = await model.select();

    return this.success(data);
  }
};