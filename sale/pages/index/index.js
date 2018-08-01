// pages/z_test/index.js
var util = require("../../utils/util.js");
var api = require("../../config/api.js");
var user = require("../../services/user.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlPrefix: null,
    storeList:[]
    ,orderList:[]
    ,storeGain:{}
    , todayGain:{}
  },
  getStoreSale: function () {
    let that = this;
    util.request(api.StoreSale, { mobile: app.globalData.scene }).then(res => {
      console.log(res);
      var storeGain={store:0,gain:0};
      //库存列表
      res.data.storeList.forEach(function (item) {
        //console.log(item.goods_name + '\t' + item.list_pic_url);
        storeGain.store+=item.trade_price*item.number;
        storeGain.gain +=(item.retail_price- item.trade_price) * item.number;
      });
      //订单列表
      //当日利润统计  

      var todayGain = { total: 0, gain: 0 };
      var t=new Date();
      var today = t.getFullYear() + '-' + (t.getMonth()+1) + '-' + t.getDate();
      res.data.orderList.forEach(function(item){
        var t1 = new Date(item.add_time);
        var date = t1.getFullYear() + '-' + (t1.getMonth()+1) + '-' + t1.getDate();
        var date1 = (t1.getMonth() + 1) + '-' + t1.getDate()+' '+t1.getHours()+':'+t1.getMinutes();
        item.date=date1;
        if(today==date){
          todayGain.total+=item.retail_price;
          todayGain.gain += (item.retail_price - item.order_price);
        }
      });
      that.setData({
        storeList: res.data.storeList
        , orderList: res.data.orderList
        ,storeGain: storeGain
        , todayGain: todayGain
      });
      // app.globalData.saleInfo = res.data.saleInfo;
    });
  },
  goStoreDetail:function(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      urlPrefix: api.HOST
    });
    this.getStoreSale();
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
    this.getStoreSale();
  
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