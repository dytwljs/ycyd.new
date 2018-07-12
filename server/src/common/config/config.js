// default config
module.exports = {
  default_module: 'api',
  workers:1,
  weixin: {
    appid: 'wx1ca22e3163a07ec6', // 小程序 appid
    secret: 'cb8040536dcc0afb7e3eca7bde0d5ecd', // 小程序密钥
    appid_sale: 'wx8532fc4e69761434', // 小程序 appid
    secret_sale: '11370c13e883b4b09f13df7218dc511b', // 小程序密钥
    mch_id: '1504348391', // 商户帐号ID
    partner_key: 'cecdb8040536dcc0afb7e3eca7bde0d5', // 微信支付密钥
    notify_url: 'https://www.dtywljs.com/api/pay/notify' // 微信异步通知，例：https://www.yc.com/api/pay/notify
  },
  express: {
    // 快递物流信息查询使用的是快递鸟接口，申请地址：http://www.kdniao.com/
    appid: '', // 对应快递鸟用户后台 用户ID
    appkey: 'cecdb8040536dcc0afb7e3eca7bde0d5', // 对应快递鸟用户后台 API key
    request_url: 'http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx'
  }
};
