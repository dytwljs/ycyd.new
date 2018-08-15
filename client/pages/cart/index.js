// pages/z_test/index.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: { currentPage:1,pageSize:0,totalPages:0,count:0,length:0},
    orderList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      'page.pageSize':parseInt (app.globalData.rpxHeight/120)
    });
    this.getList();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    // if (!app.globalData.checkLogin) {
    //   user.loginByWeixin(userInfo, 'user').then(res => {
    //     app.globalData.userInfo = res.data.userInfo;
    //     app.globalData.token = res.data.token;
    //     that.setData({
    //       userInfo: res.data.userInfo
    //     });
    //   }).catch((err) => {
    //     console.log(err)
    //   });
    // } 
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        //此处为获取微信信息后的业务方法
      },
      fail: function () {

        wx.navigateTo({
          url: '../ucenter/login/index',
        });
        //获取用户信息失败后。请跳转授权页面
        // wx.showModal({
        //   title: '警告',
        //   content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
        //   success: function (res) {
        //     if (res.confirm) {
        //       // console.log('用户点击确定')
        //       // wx.navigateTo({
        //       //   url: '../ucenter/login/index',
        //       // })
        //     }
        //   }
        // })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  getList: function () {
    var that = this;
    util.request(api.OrderTaxiList, that.data.page).then(res => {
      console.log(res);
      that.setData({
        'page.count': res.data.orderList.count
        , 'page.currentPage': res.data.orderList.currentPage
        , 'page.pageSize': res.data.orderList.pageSize
        , 'page.totalPages': res.data.orderList.totalPages
        , 'page.length': res.data.orderList.data.length
      });
      res.data.orderList.data.forEach(function (item) {
        // var t1 = new Date(item.add_time);
        item.date = util.formatTimeMDHM(item.add_time);
      });
      that.setData({
        orderList: res.data.orderList.data
      })
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.page.currentPage==1)
      return;
    this.setData({
        'page.currentPage': this.data.page.currentPage-1
      });
    this.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.page.currentPage == this.data.page.totalPages)
      return;
    this.setData({
        'page.currentPage': this.data.page.currentPage + 1
      });
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})