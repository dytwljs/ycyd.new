const Base = require('./base.js');
const rp = require('request-promise');

module.exports = class extends Base {

  async loginByWeixinAction() {
    const code = this.post('code');
    const fullUserInfo = this.post('userInfo');
    const userInfo = fullUserInfo.userInfo;
    const clientIp = ''; // 暂时不记录 ip
    const userType = this.post('userType');
    var appCode = await this.GetAppCodeByType(userType);
    var qs = {
      grant_type: 'authorization_code',
      js_code: code,
      secret: appCode.secret,
      appid: appCode.appid
    };
    // 获取openid
    const options = {
      method: 'GET',
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      qs: qs
    };
    let sessionData = await rp(options);
    sessionData = JSON.parse(sessionData);
    if (!sessionData.openid) {
      return this.fail('登录失败,获取sessionData失败');
    }
    // 验证用户信息完整性
    const crypto = require('crypto');
    const sha1 = crypto.createHash('sha1').update(fullUserInfo.rawData + sessionData.session_key).digest('hex');
    if (fullUserInfo.signature !== sha1) {
      return this.fail('登录失败,验证用户信息完整性失败');
    }
    // 解释用户数据
    const WeixinSerivce = this.service('weixin', 'api');
    // const weixinUserInfo = await WeixinSerivce.decryptUserInfoData(sessionData.session_key, fullUserInfo.encryptedData, fullUserInfo.iv);
    const weixinUserInfo = await WeixinSerivce.decryptUserInfoData(sessionData.session_key, fullUserInfo.encryptedData, fullUserInfo.iv, qs.appid);
    if (think.isEmpty(weixinUserInfo)) {
      return this.fail('登录失败,解析用户数据失败');
    }
    const newUserInfo = await this.HandleByType(sessionData, userType, weixinUserInfo, userInfo, clientIp);

    if (think.isEmpty(newUserInfo)) {
      return this.fail('登录失败,获取用户表信息失败');
    }
    // sessionData.user_id = userId;
    sessionData.user_id = newUserInfo.id;

    const TokenSerivce = this.service('token', 'api');
    const sessionKey = await TokenSerivce.create(sessionData);

    if (think.isEmpty(newUserInfo) || think.isEmpty(sessionKey)) {
      return this.fail('登录失败');
    }

    return this.success({
      token: sessionKey,
      userInfo: newUserInfo
    });
  }

  async HandleSale(sessionData, weixinUserInfo, userInfo, clientIp) {
    // 根据openid查找用户是否已经注册
    let userId = await this.model('sale').where({
      openid: sessionData.openid
    }).getField('id', true);
    if (think.isEmpty(userId)) {
      // 注册
      userId = await this.model('sale').add({
        // openid: ['exp', 'UUID()'],
        username: '微信用户' + think.uuid(6),
        // password: sessionData.openid,
        register_time: parseInt(new Date().getTime() / 1000),
        register_ip: clientIp,
        last_visit_time: parseInt(new Date().getTime() / 1000),
        last_login_ip: clientIp,
        openid: sessionData.openid,
        unionid: weixinUserInfo.unionId,
        avatar: userInfo.avatarUrl || '',
        gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
        nickname: userInfo.nickName,
        birthday: userInfo.birthday,
        user_info: JSON.stringify(userInfo),
        authorize: 1
      });
    }

    // 查询用户信息
    // const newUserInfo = await this.model('sale').field(['id', 'openid', 'unionid', 'username', 'nickname', 'gender', 'avatar', 'birthday', 'mobile', 'authorize']).where({
    //   openid: sessionData.openid
    // }).find();

    const newUserInfo = await this.model('vw_sale').field(['*']).where({
      openid: sessionData.openid
    }).find();
    // 更新登录信息
    await this.model('sale').where({
      id: userId
    }).update({
      last_visit_time: parseInt(new Date().getTime() / 1000),
      last_login_ip: clientIp
    });
    newUserInfo.id = userId;
    return newUserInfo;

  }

  async HandleUser(sessionData, weixinUserInfo, userInfo, clientIp) {
    // 根据openid查找用户是否已经注册
    let userId = await this.model('user').where({
      openid: sessionData.openid
    }).getField('id', true);
    if (think.isEmpty(userId)) {
      // 注册
      userId = await this.model('user').add({
        // username: '微信用户' + think.uuid(6),
        username: userInfo.nickName,
        password: sessionData.openid,
        register_time: parseInt(new Date().getTime() / 1000),
        register_ip: clientIp,
        last_login_time: parseInt(new Date().getTime() / 1000),
        last_login_ip: clientIp,
        mobile: '',
        openid: sessionData.openid,
        unionid: weixinUserInfo.unionId,
        avatar: userInfo.avatarUrl || '',
        gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
        nickname: userInfo.nickName
      });
    }

    // 查询用户信息
    const newUserInfo = await this.model('user').field(['id', 'openid', 'unionid', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({
      id: userId
    }).find();

    // 更新登录信息
    await this.model('user').where({
      id: userId
    }).update({
      last_login_time: parseInt(new Date().getTime() / 1000),
      last_login_ip: clientIp
    });
    newUserInfo.id = userId;
    return newUserInfo;
  }

  async GetPhoneAction() {
    const phoneInfo = this.post('detail');
    var userType = this.post('userType');
    var session_key = null;
    var sessionData = null;
    var user = null;
    var token = null;
    var newUserInfo =null;
    var user_id=null;

    if (think.isEmpty(this.post('code'))) {
      const tokenSerivce = think.service('token', 'api');
      user = await tokenSerivce.getUserByToken();
      session_key = user.session_key;
      user_id = user.user_id;
      newUserInfo = await this.model('sale').field(['id', 'openid', 'unionid', 'username', 'nickname', 'gender', 'avatar', 'birthday', 'mobile', 'authorize']).where({
        id: user.user_id
      }).find();
      if (think.isEmpty(newUserInfo))
        return this.fail('找不到对应用户信息');  
    } else {
      sessionData = await this.GetSessionByCode(this.post('code'), userType, phoneInfo);
      session_key = sessionData.session_key;
      // 查询用户信息
      newUserInfo = await this.model('sale').field(['id', 'openid', 'unionid', 'username', 'nickname', 'gender', 'avatar', 'birthday', 'mobile', 'authorize']).where({
        openid: sessionData.openid
      }).find();
      if (think.isEmpty(newUserInfo))
        return this.fail('找不到对应用户信息');  
      user_id = newUserInfo.id;
      const TokenSerivce = this.service('token', 'api');
      sessionData.user_id = user_id;
      token = await TokenSerivce.create(sessionData);
      if (think.isEmpty(token)) {
        return this.fail('创建token失败');
      }
    }
    var appCode = await this.GetAppCodeByType(userType);
    // 解释用户数据
    const WeixinSerivce = this.service('weixin', 'api');
    const phone = await WeixinSerivce.decryptUserInfoData(session_key, phoneInfo.encryptedData, phoneInfo.iv, appCode.appid);
    if (think.isEmpty(phone)) {
      return this.fail('获取电话失败');
    }
    var update = null;
    // 查询用户手机号是否注册 ['mobile', 'name', 'authorize']
    const sale_reg = await this.model('sale_reg').field(['*']).where({
      mobile: phone.phoneNumber
    }).find();
    //后台未登记此手机号
    if (think.isEmpty(sale_reg)) {
      update = await this.model('sale').where({
        id: user_id
      }).update({
        mobile: phone.phoneNumber,
        authorize: 2
        ,last_visit_time: parseInt(new Date().getTime() / 1000)
      });
      newUserInfo.authorize = 2;
    } else {//后台登记手机号，已审核通过
      if (sale_reg.authorize == 1) {
        update = await this.model('sale').where({
          id: user_id
        }).update({
          mobile: phone.phoneNumber,
          authorize: 9
          ,username:sale_reg.name
          ,last_visit_time: parseInt(new Date().getTime() / 1000)
        });
        newUserInfo.authorize = 9;
        newUserInfo.name = sale_reg.name;
      } else {//后台登记手机号，未审核
        update = await this.model('sale').where({
          id: user_id
        }).update({
          mobile: phone.phoneNumber,
          authorize: 3
          ,username:sale_reg.name
          ,last_visit_time: parseInt(new Date().getTime() / 1000)
        });
        newUserInfo.authorize = 3;
        newUserInfo.name = sale_reg.name;
      }
    }
    newUserInfo.mobile=phone.phoneNumber;
    if (update > 0)
      return this.success({
        userInfo: newUserInfo,
        token: token
      });
    else
      return this.fail('手机号写入数据库失败');
  }
  async GetSessionByCode(code, userType, phoneInfo) {

    // const fullUserInfo = this.post('userInfo');
    var appCode = await this.GetAppCodeByType(userType);
    var qs = {
      grant_type: 'authorization_code',
      js_code: code,
      secret: appCode.secret,
      appid: appCode.appid
    };
    // 获取openid
    const options = {
      method: 'GET',
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      qs: qs
    };
    let sessionData = await rp(options);
    sessionData = JSON.parse(sessionData);
    if (!sessionData.openid) {
      return this.fail('登录失败,获取sessionData失败');
    }
    return sessionData;

  }
  async HandleStore() {

  }

  /**
   * 根据用户类型获取appid secret
   * 
   */
  async GetAppCodeByType(userType) {

    var appCode = {
      secret: think.config('weixin.secret'),
      appid: think.config('weixin.appid')
    };
    if (userType == 'sale')
      appCode = {
        secret: think.config('weixin.secret_sale'),
        appid: think.config('weixin.appid_sale')
      };
    if (userType == 'store')
      appCode = {
        secret: think.config('weixin.secret_store'),
        appid: think.config('weixin.appid_store')
      };
    return appCode;
  }
  async HandleByType(sessionData, userType, weixinUserInfo, userInfo, clientIp) {
    if (think.isEmpty(userType))
      return null;
    if (userType == 'sale')
      return await this.HandleSale(sessionData, weixinUserInfo, userInfo, clientIp);
    return await this.HandleUser(sessionData, weixinUserInfo, userInfo, clientIp);
  }

  async logoutAction() {
    return this.success();
  }

  //g_meem old only user
  // async loginByWeixinAction() {
  //   const code = this.post('code');
  //   const fullUserInfo = this.post('userInfo');
  //   const userInfo = fullUserInfo.userInfo;
  //   const clientIp = ''; // 暂时不记录 ip

  //   // 获取openid
  //   const options = {
  //     method: 'GET',
  //     url: 'https://api.weixin.qq.com/sns/jscode2session',
  //     qs: {
  //       grant_type: 'authorization_code',
  //       js_code: code,
  //       secret: think.config('weixin.secret'),
  //       appid: think.config('weixin.appid')
  //     }
  //   };

  //   let sessionData = await rp(options);
  //   sessionData = JSON.parse(sessionData);
  //   if (!sessionData.openid) {
  //     return this.fail('登录失败');
  //   }

  //   // 验证用户信息完整性
  //   const crypto = require('crypto');
  //   const sha1 = crypto.createHash('sha1').update(fullUserInfo.rawData + sessionData.session_key).digest('hex');
  //   if (fullUserInfo.signature !== sha1) {
  //     return this.fail('登录失败');
  //   }

  //   // 解释用户数据
  //   const WeixinSerivce = this.service('weixin', 'api');
  //   const weixinUserInfo = await WeixinSerivce.decryptUserInfoData(sessionData.session_key, fullUserInfo.encryptedData, fullUserInfo.iv);
  //   if (think.isEmpty(weixinUserInfo)) {
  //     return this.fail('登录失败');
  //   }

  //   // 根据openid查找用户是否已经注册
  //   let userId = await this.model('user').where({ weixin_openid: sessionData.openid }).getField('id', true);
  //   if (think.isEmpty(userId)) {
  //     // 注册
  //     userId = await this.model('user').add({
  //       username: '微信用户' + think.uuid(6),
  //       password: sessionData.openid,
  //       register_time: parseInt(new Date().getTime() / 1000),
  //       register_ip: clientIp,
  //       last_login_time: parseInt(new Date().getTime() / 1000),
  //       last_login_ip: clientIp,
  //       mobile: '',
  //       openid: sessionData.openid,
  //       unionid:weixinUserInfo.unionId,
  //       avatar: userInfo.avatarUrl || '',
  //       gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
  //       nickname: userInfo.nickName
  //     });
  //   }

  //   sessionData.user_id = userId;

  //   // 查询用户信息
  //   const newUserInfo = await this.model('user').field(['id', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({ id: userId }).find();

  //   // 更新登录信息
  //   userId = await this.model('user').where({ id: userId }).update({
  //     last_login_time: parseInt(new Date().getTime() / 1000),
  //     last_login_ip: clientIp
  //   });

  //   const TokenSerivce = this.service('token', 'api');
  //   const sessionKey = await TokenSerivce.create(sessionData);

  //   if (think.isEmpty(newUserInfo) || think.isEmpty(sessionKey)) {
  //     return this.fail('登录失败');
  //   }

  //   return this.success({ token: sessionKey, userInfo: newUserInfo });
  // }
};