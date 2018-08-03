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
  onLaunch: function(options) {
    // this.handOptions(options);
    //获取用户的登录信息
    user.checkLogin().then(res => {
      console.log('app login')
      this.globalData.userInfo = wx.getStorageSync('userInfo');
      this.globalData.token = wx.getStorageSync('token');
      this.globalData.checkLogin = true;
    }, function(err) {
      console.log(err);
      });
    console.log('onLaunch   End');
  },
  onShow: function (options) {
    this.handOptions(options);
    console.log(options);
    console.log(options.query.scene);
    console.log('onShow    End');

  },
  handOptions: function(options) {
    console.log(options);
    console.log(options.query.scene);
    var a = decodeURIComponent('sal-13510118416');
    if (!options.query.scene) {
      this.globalData.scene_type = 'sal';
      this.globalData.scene = '13510118416';
      return;
    } else {
      this.handScene(options.query.scene);

      // var scene = decodeURIComponent(options.query.scene);
      // var sce = null, teyp = null;
      // sce = scene.substr(4, scene.length - 4);
      // type = scene.substr(0, 4);
      // if (sce != this.globalData.scene || type != this.globalData.scene_type)
      //   this.globalData.scene_change = true;
      // this.globalData.scene = sce;
      // this.globalData.scene_type = type;


      // if (scene.substr(0, 4) == 'sal-') {
      //   this.globalData.scene_type = 'sal';
      //   this.globalData.scene = scene.substr(4, scene.length - 4);
      // } else if (scene.substr(0, 4) == 'cod-') {
      //   this.globalData.scene_type = 'cod';
      //   this.globalData.scene = scene.substr(4, scene.length - 4);
      // } else {
      //
    //  }

    }
    // wx.setStorageSync('scene','97574194493047655');
    // this.shareTicket='';
    // if(options && options.scene&&options.scene==1044){
    //   this.shareTicket=options.shareTicket?options.shareTicket:'';
    // }
    //

  },
  handScene: function (scene) {
    var scene = decodeURIComponent(scene);
    var sce = null, type = null;
    sce = scene.substr(4, scene.length - 4);
    type = scene.substr(0, 3);
    // if (sce != this.globalData.scene || type != this.globalData.scene_type)
    //   this.globalData.scene_change = true;
    this.globalData.scene_change = (sce != this.globalData.scene || type != this.globalData.scene_type);
    this.globalData.scene = sce;
    this.globalData.scene_type = type;
  },
  globalData: {
    scene: '',
    scene_type: 'gue',
    scene_change :false,
    saleInfo: {},
    userInfo: {
      nickname: 'Hi,游客',
      username: '点击去登录',
      checkLogin: false,
      // avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
      avatar: '/static/images/logo.png',
      mobile: '',
      authorize: 0
    },
    token: '',
    // pay_test:true
  }
})