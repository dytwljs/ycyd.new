// pages/z_test/index.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: { currentPage:1,pageSize:7},
    orderList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      'page.pageSize':parseInt ((app.globalData.windowHeight*2-120)/120)+1
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
  onShow: function() {

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