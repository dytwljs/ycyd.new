const Base = require("./base.js");
const config = require('../config/config.js');
const qr = require('../../common/utils/createQr.js');
const fs = require('fs');
module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get("page") || 1;
    const size = this.get("size") || 10;
    const username = this.get("username") || "";

    const model = this.model("sale");
    const dataLayer2 = await model
      .where({
        layer: 2
      })
      .select();
    // const dataLayer2    =await model.where({layer:{'>',1}}).select();
    const data = await model
      .where({
        username: ["like", `%${username}%`],
        layer: ["<>", 1]
      })
      .order(["register_time DESC"])
      .page(page, size)
      .countSelect();
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
    // console.log(this.ctx.origin);
    return this.success(data);
  }

  async infoAction() {
    const id = this.get("id");
    const model = this.model("sale");
    const data = await model
      .where({
        id: id
      })
      .find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }
    // console.log(this.DBERR);
    const values = this.post();
    const id = this.post("id");
    const isRecordNew = this.post("isRecordNew");

    const model = this.model("sale");
    var result;
    try {
      if (isRecordNew) result = await model.thenAdd(values, {
        id: 0
      });
      else result = await model.where({
        id: id
      }).update(values);
    } catch (error) {
      console.log(error);
      return this.fail(error.errno, error.message);
    }
    return this.DAReturn(result, values);
    // return this.fail(this.DBERR.ERR_INSERT_EXIST_CODE,this.DBERR.ERR_INSERT_EXIST_MSG,result);
    // return this.success(result);
  }

  async destoryAction() {
    const id = this.post("id");
    await this.model("sale")
      .where({
        id: id
      })
      .limit(1)
      .delete();
    return this.success();
  }
  async getAllCategoryAction() {
    const model = this.model("sale");
    const data = await model.select();

    return this.success(data);
  }
  /**
   * 取得父级经销商
   */
  async parentSaleAction() {
    const model = this.model("sale");
    // const data = await model.where({layer: 2}).order(['id ASC']).select();
    // const data = await model.where({layer: {1,2}}).order(['id ASC']).select();
    const data = await model
      .where({
        layer: ["<", 3]
      })
      .order(["id ASC"])
      .select();

    return this.success(data);
  }
  /**
   * index action
   * @return {Promise} []
   */
  async regAction() {
    const page = this.get("page") || 1;
    const size = this.get("size") || 10;
    const username = this.get("username") || "";

    const model = this.model("sale_reg");
    const dataLayer2 = await model
      .where({
        layer: 2
      })
      .select();
    // const dataLayer2    =await model.where({layer:{'>',1}}).select();
    model._pk = 'mobile';
    const data = await model
      .where({
        username: ["like", `%${username}%`],
        layer: ["<>", 1]
      })
      .order(["create_time DESC"])
      .page(page, size)
      .countSelect();
    return this.success(data);
  }


  async infoRegAction() {
    const mobile = this.get("mobile");
    const model = this.model("sale_reg");
    const data = await model
      .where({
        mobile: mobile
      })
      .find();

    return this.success(data);
  }
  async findSaleRegAction() {
    if (!this.isPost) {
      return this.fail();
    }
    const mobile = this.post("mobile");
    //const isRecordNew = this.post("isRecordNew");
    const find = await this.model("sale_reg")
      .field(['count(1) as count'])
      .where({
        mobile: mobile
      })
      .select();
    if (find && find[0].count > 0)
      return this.fail();
    return this.success(find);
  }

  async storeRegAction() {
    if (!this.isPost) {
      return false;
    }
    // console.log(this.DBERR);
    const values = this.post();
    const mobile = this.post("mobile");
    const isRecordNew = this.post("isRecordNew");
    values.authorize = values.authorize ? 1 : 0;
    const model = this.model("sale_reg");
    var result;
    try {
      //条件码文件路径
      const qrPath_sale = think.config('weixin.qrPath_sale');
      // const file= qrPath_sale + values.username + '.' + values.mobile + '.jpg';
      // // const path =think.ROOT_PATH + "/www" + file;'
      const file = qrPath_sale + values.mobile + '.jpg';
      const path = this.getFullPath(file);
      var genQr=false;
      if (isRecordNew) {
        values.qr_code = file;
        genQr=true;
        result = await model.add(values);
      } else {
        if (think.isEmpty(values.qr_code)) {
          values.qr_code = file;
          genQr=true;
        } else {
          fs.access(path, function (err) {
            //    文件和目录不存在的情况下；
            if (err.code == "ENOENT") {
              genQr=true;
              //console.log("文件和目录不存在")
            }
          });
        }

        result = await model.where({
          mobile: mobile
        }).update(values);
      }
      if(genQr)
        await this.createQr(values.mobile, path);
      // values = await this.createQr1(values);
    } catch (error) {
      console.log(error);
      return this.fail(error.errno, error.message);
    }
    return this.DAReturn(result, values);
    // return this.fail(this.DBERR.ERR_INSERT_EXIST_CODE,this.DBERR.ERR_INSERT_EXIST_MSG,result);
    // return this.success(result);
  }

  async destoryRegAction() {
    const mobile = this.post("mobile");
    await this.model("sale_reg")
      .where({
        mobile: mobile
      })
      .limit(1)
      .delete();
    // TODO 删除图片
    //条件码文件路径
    const qrPath_sale = think.config('weixin.qrPath_sale');
    const file = qrPath_sale + values.mobile + '.jpg';
    const path = this.getFullPath(file);
    try {
      fs.access(path, function (err) {
        //    文件和目录存在的情况下；
        if (err.code != "ENOENT") {
          fs.unlink(path, function (error) {
            if (err)
              return this.fail(error.errno, error.message);
            return this.success();
          })
        }
      });

    } catch (error) {
      console.log(error);
      return this.fail(error.errno, error.message);
    }
    return this.success();
  }
  /**
   * 取得父级经销商
   */
  async parentSaleRegAction() {
    const model = this.model("sale_reg");
    // const data = await model.where({layer: 2}).order(['id ASC']).select();
    // const data = await model.where({layer: {1,2}}).order(['id ASC']).select();
    const data = await model
      .where({
        layer: ["<", 3]
      })
      .order(["mobile ASC"])
      .select();

    return this.success(data);
  }

  // async createQr1(values) {
  //   const mobile = values.mobile;

  //   const qrPath_sale = think.config('weixin.qrPath_sale');
  //   // const file =  values.username + '.' + values.mobile + '.jpg';
  //   // const path = think.ROOT_PATH + "/www" + qrPath_sale +file;
  //   // const file =  values.mobile + '.jpg';
  //   const path = this.getFullPath(values.mobile);
  //   values.qr_code = file;
  //   // const appid = config.weixin.appid_sale;
  //   const appid = think.config('weixin.appid');
  //   const secret = think.config('weixin.secret');
  //   // const appid = think.config('weixin.appid_sale');
  //   // const secret = think.config('weixin.secret_sale');
  //   const urlToken = think.config('weixin.urlToken');
  //   const urlWxCode = think.config('weixin.urlWxCode');
  //   const qrPage = think.config('weixin.qrPage');
  //   const width = think.config('weixin.qr_width');
  //   // const qrPath_sale = config.weixin.qrPath_sale;


  //   qr.createQr(width, urlToken, urlWxCode, appid, secret, mobile, qrPage, path);
  //   return values;
  // }
  getFullPath(file) {
    return think.ROOT_PATH + "/www" + file;
  }
  async createQr(mobile, path) {
    const appid = think.config('weixin.appid');
    const secret = think.config('weixin.secret');
    // const appid = think.config('weixin.appid_sale');
    // const secret = think.config('weixin.secret_sale');
    const urlToken = think.config('weixin.urlToken');
    const urlWxCode = think.config('weixin.urlWxCode');
    const qrPage = think.config('weixin.qrPage');
    const width = think.config('weixin.qr_width');
    // const qrPath_sale = config.weixin.qrPath_sale;


    qr.createQr(width, urlToken, urlWxCode, appid, secret, mobile, qrPage, path);
  }
};