// pages/ucenter/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },
  goQrCode: function () {
    wx.navigateTo({      url: '/pages/ucenter/qrcode/index',})
  },
  goEnterOrder: function () {
    wx.navigateTo({ url: '/pages/enterOrder/index', })
  },
  goSaleOrder: function () {
    wx.navigateTo({ url: '/pages/saleOrder/index', })
  },
  goPayIn: function () {
    wx.navigateTo({ url: '/pages/payIn/index', })
  },
  goPayOut: function () {
    wx.navigateTo({ url: '/pages/payOut/index', })
  },
  goStoreHouse: function () {
    wx.navigateTo({ url: '/pages/ucenter/storeHouse/index', })
  },
  goContact: function () {
    wx.navigateTo({ url: '/pages/ucenter/contact/index', })
  },
  goHelp: function () {
    wx.navigateTo({url: '/pages/ucenter/help/index',})
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
    this.setData({ userInfo: getApp().globalData.userInfo});
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