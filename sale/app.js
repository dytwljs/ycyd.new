var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

/**     getStorageSync
 * wx.getStorageSync('userInfo')  用户信息
 * wx.getStorageSync('token')     
 *  wx.getStorageSync('addressId')    地址信息
 * 
 *      globalData
 * globalData.scene
 * globalData.saleInfo
 * globalData.userInfo
 */

App({
  getWindowHeight: function () {
    var height = 0;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.screenWidth);       //手机屏幕宽度
        console.log(res.screenHeight);      //手机屏幕高度
        console.log(res.windowWidth);       //手机屏幕宽度
        console.log(res.windowHeight);      //手机屏幕高度
        height = res.windowHeight;//此处this.globalData不可用？？
      }
    });
    this.globalData.windowHeight = height;
  },
  onLaunch: function (options) {
    this.getWindowHeight();
    // // util.request(api.Z_Test,{},'POST').then(res=>{
    // //   console.log(res);
    // // });

    // this.handOptions(options);

    // //获取用户的登录信息
    // user.checkLogin().then(res => {
    //   console.log('app login')
    //   this.globalData.userInfo = wx.getStorageSync('userInfo');
    //   this.globalData.token = wx.getStorageSync('token');
    //   this.globalData.checkLogin = true;

    //   if (this.globalData.userInfo.authorize < 9)
    //     wx.navigateTo({
    //       url: '../../pages/ucenter/auth/login',
    //     });
    // }, function (err) {
    //   wx.navigateTo({
    //     url: '../../pages/ucenter/auth/login',
    //   });

    // });
  },
  onLoad: function (options) {
    console.log('app onLoad');

  },
  onShow: function (options) {
    this.handOptions(options);
    // console.log('app onShow');

    //获取用户的登录信息
    user.checkLogin().then(res => {
      console.log('app login')
      this.globalData.userInfo = wx.getStorageSync('userInfo');
      this.globalData.token = wx.getStorageSync('token');
      this.globalData.checkLogin = true;

      if (this.globalData.userInfo.authorize < 9) {
        console.log('authorize-> ' + this.globalData.userInfo.authorize);
        wx.reLaunch({ url: '/pages/ucenter/auth/login' });
        // wx.navigateTo({
        //   url: '../../pages/ucenter/auth/login'
        // });
      }
    }, function (err) {
      wx.reLaunch({ url: '/pages/ucenter/auth/login' });
      console.log('user.checkLogin() err');
      console.log(err);

    });
  },
  onReady:function(option){
    console.log('app.onReady');
  },
  onPageNotFound: function (options) {
    console.log('app.onPageNotFound');
  },
  
  handOptions: function (options) {
    console.log(options);
    console.log(options.scene);
    var scene = decodeURIComponent(options.query.scene);
    //wx.setStorageSync('scene',scene);
    this.globalData.scene = scene;
    // wx.setStorageSync('scene','97574194493047655');
    // this.shareTicket='';
    // if(options && options.scene&&options.scene==1044){
    //   this.shareTicket=options.shareTicket?options.shareTicket:'';
    // }
    //

  },

  globalData: {
    scene: '',
    saleInfo: {},
    userInfo: {
      nickname: 'Hi,游客',
      username: '点击去登录',
      checkLogin:false,
      // avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
      avatar: '/static/images/logo.png'
      ,mobile:''
      ,authorize:0
    },
    token: '',
    windowHeight: 667
    // pay_test:true
  }
})