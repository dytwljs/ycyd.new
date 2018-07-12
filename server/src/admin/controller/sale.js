const Base = require('./base.js');

module.exports = class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        const page = this.get('page') || 1;
        const size = this.get('size') || 10;
        const name = this.get('name') || '';

        const model = this.model('sale');
        const dataLayer2 = await model.where({
            layer: 2
        }).select();
        // const dataLayer2    =await model.where({layer:{'>',1}}).select();
        const data = await model.where({
            name: ['like', `%${name}%`],layer:['<>',1]
        }).order(['create_time DESC']).page(page, size).countSelect();
        // const saleList = [];
        // dataLayer2.map((item) => {
        //   var isAdd = false;
        //   data.data.map((child) => {
        //     if (child.id == item.id || child.parent_id == item.id) {
        //       if (!isAdd) {
        //         saleList.push(item);
        //         isAdd = true;
        //       }
        //       if (child.parent_id == item.id)
        //         saleList.push(child);
        //     }
        //   });
    // });
console.log(this.ctx.origin);
return this.success(data);
}

async infoAction() {
    const id = this.get('id');
    const model = this.model('sale');
    const data = await model.where({
        id: id
    }).find();

    return this.success(data);
}

async storeAction() {
    if (!this.isPost) {
        return false;
    }
    // console.log(this.DBERR);
    const values = this.post();
    const id = this.post('id');
    const isRecordNew = this.post('isRecordNew');

    const model = this.model('sale');
    var result;
    try {
    if (isRecordNew)
        result = await model.thenAdd(values, {id: 0});
    else
        result = await model.where({id: id}).update(values);        
    } catch (error) {        
        console.log(error);
        return this.fail(error.errno,error.message);
    }
    return this.DAReturn(result, values);
    // return this.fail(this.DBERR.ERR_INSERT_EXIST_CODE,this.DBERR.ERR_INSERT_EXIST_MSG,result);
    // return this.success(result);
}

async destoryAction() {
    const id = this.post('id');
    await this.model('sale').where({
        id: id
    }).limit(1).delete();
    // TODO 删除图片
    return this.success();
}
async getAllCategoryAction() {
        const model = this.model('sale');
        const data = await model.select();

        return this.success(data);
    }
    /**
     * 取得二级经销商
     */
async parentSaleAction() {
    const model = this.model('sale');
    // const data = await model.where({layer: 2}).order(['id ASC']).select();
    // const data = await model.where({layer: {1,2}}).order(['id ASC']).select();
    const data = await model.where({
        layer: ['<', 3]
    }).order(['id ASC']).select();

    return this.success(data);
}
};