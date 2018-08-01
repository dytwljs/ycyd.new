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
  onLaunch: function (options) {
    this.handOptions(options);

    // util.request(api.Z_Test,{},'POST').then(res=>{
    //   console.log(res);
    // });

    //获取用户的登录信息
    user.checkLogin().then(res => {
      console.log('app login')
      this.globalData.userInfo = wx.getStorageSync('userInfo');
      this.globalData.token = wx.getStorageSync('token');
      this.globalData.checkLogin = true;
    }, function (err) {
      console.log(err);
    });
  },
  handOptions: function (options) {
    console.log(options);
    console.log(options.scene);
    var scene = decodeURIComponent(options.query.scene);
    scene='sal-13510118416';
    //wx.setStorageSync('scene',scene);
    this.globalData.scene = scene;
    if(scene.substr(0,4)=='sal-'){
      this.globalData.scene_type='sal';
      this.globalData.scene =scene.substr(4,scene.length-4);
    }else if (scene.substr(0, 4) == 'cod-') {
      this.globalData.scene_type = 'cod';
      this.globalData.scene = scene.substr(4, scene.length - 4);
    }else{

    }
    // wx.setStorageSync('scene','97574194493047655');
    // this.shareTicket='';
    // if(options && options.scene&&options.scene==1044){
    //   this.shareTicket=options.shareTicket?options.shareTicket:'';
    // }
    //

  },
  
  globalData: {
    scene: '',
    scene_type:'gue',
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
    // pay_test:true
  }
})