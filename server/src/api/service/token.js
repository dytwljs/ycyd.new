const jwt = require('jsonwebtoken');
const secret = 'SLDLKKDS323ssdd@#@@gf';

module.exports = class extends think.Service {
  /**
   * 根据header中的X-ycyd-Token值获取用户id
   */
  async getUserId() {
    const token = think.token;
    if (!token) {
      return 0;
    }
    const result = await this.parse();
    if (think.isEmpty(result) || result.user_id <= 0) {
      return 0;
    }
    return result.user_id;
  }
  async getUserSessionKey() {
    const token = think.token;
    if (!token) {
      return null;
    }
    const result = await this.parse();
    if (think.isEmpty(result) || think.isEmpty(result.session_key)) {
      return null;
    }
    return result.session_key;
  }
  async getUserByToken() {
    const token = think.token;
    if (!token) {
      return null;
    }
    const result = await this.parse();
    if (think.isEmpty(result) || result.user_id <= 0) {
      return null;
    }
    return result;
  }
  /**
   * 根据值获取用户信息
   */
  async getUserInfo() {
    const userId = await this.getUserId();
    if (userId <= 0) {
      return null;
    }

    const userInfo = await this.model('user').field(['id', 'openid', 'unionid', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({
      id: userId
    }).find();

    return think.isEmpty(userInfo) ? null : userInfo;
  }

  async create(userInfo) {
    const token = jwt.sign(userInfo, secret);
    return token;
  }

  async parse() {
    if (think.token) {
      try {
        return jwt.verify(think.token, secret);
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  async verify() {
    const result = await this.parse();
    if (think.isEmpty(result)) {
      return false;
    }

    return true;
  }
};