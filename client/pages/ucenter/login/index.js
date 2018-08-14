// pages/ucenter/login/index.js
// var util = require("../../../utils/util.js");
// var api = require("../../../config/api.js");
var user = require("../../../services/user.js");
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  bindGetUserInfo: function (e) {
    //此处授权得到userInfo
    console.log(e.detail.userInfo);
    //接下来写业务代码

    let that = this;
    const userInfo = e.detail;

    if (!app.globalData.checkLogin) {
      user.loginByWeixin(userInfo, 'user').then(res => {
        app.globalData.userInfo = res.data.userInfo;
        app.globalData.token = res.data.token;
        // that.setData({
        //   userInfo: res.data.userInfo
        // });
        // this.checkoutOrder();
        //最后，记得返回刚才的页面
        wx.navigateBack({
          delta: 1
        })
      }).catch((err) => {
        console.log(err)
      });
    } 
    // else
    //   this.checkoutOrder();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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