// pages/ucenter/auth/login.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },
  getUserInfo: function (e) {
    let that =this;
    const userInfo = e.detail;

    if(!app.globalData.checkLogin){
      user.loginByWeixin(userInfo, 'sale').then(res => {
        app.globalData.userInfo = res.data.userInfo;
        app.globalData.token = res.data.token; 
        if (app.globalData.userInfo.authorize == 9) {
          wx.reLaunch({url: '/pages/index/index'});
          return;
        }
        that.setData({
          userInfo: res.data.userInfo
          // ,isLogin: true
        });
      }).catch((err) => {
        console.log(err)
      });
    }
  },
  getPhoneNumber: function (e) {
    let that =this;
    if(!app.globalData.checkLogin){
      // session未失效时，重新登录，获取session_key,获取电话号码
      user.getPhoneWithLogin(e.detail, 'sale').then(res => {
        console.log(res.data);
        app.globalData.userInfo = res.data.userInfo;
        if (app.globalData.userInfo.authorize == 9) {
          wx.reLaunch({ url: '/pages/index/index' });
          return;
        }
        that.setData({
          userInfo:app.globalData.userInfo
        });
        that.finishReg();
      }).catch((err) => {
        console.log(err)
      });
    
    }else{
      user.getPhone(e.detail, 'sale').then(res => {
        console.log(res.data);
        app.globalData.userInfo =res.data.userInfo;
        that.setData({
          userInfo:app.globalData.userInfo
        });
        that.finishReg();
      }).catch((err) => {
        console.log(err)
      });
    }
  },
  finishReg:function(){
    if(app.globalData.userInfo.authorize==9){
      wx.reLaunch({
        url: '/pages/index/index'
      });
      wx.showToast({
        title: '您的注册已成功',
        icon: 'success',
        duration: 2000
      });
    }
  },
  exitLogin: function () {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('phoneNumber');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
    if (app.globalData.userInfo.authorize==3){
      user.getSaleInfo().then(res=>{
        app.globalData.userInfo = res.data.saleInfo
      });
    } 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.userInfo.authorize==9) 
      wx.reLaunch({
        url: '/pages/index/index'
      });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})