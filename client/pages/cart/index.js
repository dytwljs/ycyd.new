// pages/z_test/index.js
var api = require('../../config/api.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    util.request(api.OrderTaxiList).then(res => {
      console.log(res.data);

      res.data.orderList.forEach(function(item) {
        console.log(item)

        var t1 = new Date(item.add_time);
        item.date = util.formatTimeMDHM(t1);
      });
      // var date1 = util.formatTimeMDHM(res.data.orderList);
      that.setData({
        orderList: res.data.orderList
      })
    })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})