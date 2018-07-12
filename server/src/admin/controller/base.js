const ERRS = require('../../common/config/message.js');
module.exports = class extends think.Controller {  
  async __before() {
    // 根据token值获取用户id
    think.token = this.ctx.header['x-ycyd-token'] || '';
    const tokenSerivce = think.service('token', 'admin');
    think.userId = await tokenSerivce.getUserId();

    // 只允许登录操作
    if (this.ctx.controller !== 'auth') {
      if (think.userId <= 0) {
        return this.fail(401, '请先登录');
      }
    }
  }
  DAReturn(result,data){    
    if(result.type=='exist')
    // return this.fail(this.DBERR.ERR_INSERT_EXIST_CODE,this.DBERR.ERR_INSERT_EXIST_MSG,data);
      return this.fail(this.DBERR.ERR_INSERT_EXIST_CODE,this.DBERR.ERR_INSERT_EXIST_MSG);
    return this.success(data);
  }
  get DBERR(){
    return ERRS.ERRORS.DBERR;
  }
  // get ERRORS(){
  //   return ERRS;
  // }
  // set ERRORS(errs){
  //   if(this.ERRORS==null)
  //     this.ERRORS=errs;
  // }
};
