// pages/qrcode/index.js
var util = require("../../utils/util.js");
var api = require("../../config/api.js");
var user = require("../../services/user.js");
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    storeList: [],
    saleInfo:{},
    isEditCart: true,
    urlPrefix: null,
    isSelected: false,
    total_price: 0.00,
    total_price_sale: 0.00
  },
  handScene: function (scene) {
    let that = this;
    // util.request(api.StoreSale, {
    //       id: scene
    //     },
    //     "POST"
    //   )
    //   .then(function (res) {
    //     if (res.errno === 0) {
    //       console.log(res.data);
    //       that.setData({
    //         //storeList: res.data.storeList,
    //         storeSale: res.data.storeSale
    //       });
    //       res.data.storeList.forEach(function (e) {
    //         var store = that.data.storeList.find(st => {
    //           if (st.id == e.id) return st;
    //         });
    //         if (store) e.checked = store.checked;
    //         // e.checked=e.id==that.data.storeSale[0].id?true:false;
    //         if (e.id == that.data.storeSale[0].id) e.checked = true;
    //       });
    //       that.setData({
    //         storeList: res.data.storeList
    //       });
    //     }
    //   });
  },
  handEan: function (ean_code) {
    //根据条件码查找到商品，并移到第一位。
    let that = this;
    let list = this.data.storeList;
    let index = list.findIndex((element) => (element.ean_code==ean_code));
    var d = list.splice(index, 1);
    d[0].checked=true;
    //选择商品，并计算价格
    d[0].check_number++;
    list.splice(0, 0, d[0]);
    this.setData({ storeList: list });
    this.afterCheck();

  },
  scan: function (e) {
    let that = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: res => {
        console.log(res.result);
        if (res.errMsg != "scanCode:ok") {
          console.log(res.errMsg);
          return;
        }
        if (res.scanType == "QR_CODE") {
          //result: "http://www.benseds.com"
        }
        if (res.scanType == "WX_CODE") {
          //path:"pages/index/index?scene=832bb850-2162-4e42-7060796a2fb8"
          //result:"http://lljnySW;-RXmNJCfP_)e9B162-4e42-7060796a2fb8"
          if (!res.path) {
            util.showErrorToast(res);
            return;
          }
          var scene = this.getScene(res.path);
          this.handScene(scene);
          console.log(scene);
        }
        if (res.scanType == "EAN_13") {
          // result: "6901028183222"
          this.handEan(res.result);
        }
      },
      fail: err => {
        console.log(err);
      },
      complete: res => {
        //       console.log(res)
      }
    });
  },
  getScene: function (path) {
    // var res = { path: 'pages/index/index?scene=832bb850-2162-4e42-7060796a2fb8' };
    var a = decodeURIComponent(path);
    var scene = null;
    if (path.indexOf("?") != -1) {
      var param = path.split("?");
      if (param[1] && param[1].indexOf("=") != -1) {
        scene = param[1].split("=")[1];
      }
    }
    return scene;
  },

  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    var checked = "storeList[" + itemIndex + "].checked";
    this.setData({
      [checked]: !this.data.storeList[itemIndex].checked
    });
    if (this.data.storeList[itemIndex].checked)
      if (this.data.storeList[itemIndex].check_number == 0) {
        var checkNumber = "storeList[" + itemIndex + "].check_number";
        this.setData({
          [checkNumber]: 1
        });
      }
    this.afterCheck();
  },
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    var checkNumber = "storeList[" + itemIndex + "].check_number";
    this.setData({
      [checkNumber]: this.data.storeList[itemIndex].check_number + 1
    });
    if (!this.data.storeList[itemIndex].checked) {
      var checked = "storeList[" + itemIndex + "].checked";
      this.setData({
        [checked]: true
      });
    }
    this.afterCheck();
  },

  cutNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    if (this.data.storeList[itemIndex].check_number == 0) return;
    var checkNumber = "storeList[" + itemIndex + "].check_number";
    this.setData({
      [checkNumber]: this.data.storeList[itemIndex].check_number - 1
    });
    if (this.data.storeList[itemIndex].check_number == 0)
      if (this.data.storeList[itemIndex].checked) {
        var checked = "storeList[" + itemIndex + "].checked";
        this.setData({
          [checked]: false
        });
      }
    this.afterCheck();
  },
  deleteCart: function () {
    let that = this;
    for (var i = 0; i < this.data.storeList.length; i++)
      if (this.data.storeList[i].checked) {
        var checked = "storeList[" + i + "].checked";
        // item.checked = false;
        that.setData({
          [checked]: false
        });
      }
    this.afterCheck();
  },
  afterCheck: function () {
    this.getTotalPrice();
    this.getSelected();
  },
  getTotalPrice: function () {
    var total = 0;
    var total_sale = 0;
    this.data.storeList.forEach(function (item) {
      if (item.checked) {
        total += item.trade_price * item.check_number;
        total_sale += item.retail_price * item.check_number;
      }
    });

    this.setData({
      total_price: total,
      total_price_sale: total_sale
    });

  },
  getSelected: function () {
    try {
      this.data.storeList.forEach(function (item) {
        if (item.checked)
          throw new Error('');
      });
    } catch (e) {
      this.setData({
        isSelected: true
      });
      return;
    }
    this.setData({
      isSelected: false
    });
  },
  getUserInfo: function (e) {
    const userInfo = e.detail;

    if (!app.globalData.checkLogin) {
      user.loginByWeixin(userInfo, 'user').then(res => {
        app.globalData.userInfo = res.data.userInfo;
        app.globalData.token = res.data.token;
        // if (app.globalData.userInfo.authorize == 9) {
        //   wx.reLaunch({ url: '/pages/index/index' });
        //   return;
        // }
        that.setData({
          userInfo: res.data.userInfo
          // ,isLogin: true
        });
      }).catch((err) => {
        console.log(err)
      });
    }
    this.checkoutOrder();
  },
  checkoutOrder: function (e) {
    console.log('checkoutOrder');
    //StoreLeave
    let that = this;
    let userInfo = getApp().globalData.userInfo;
    let saleInfo =getApp().globalData.saleInfo;
    var storeList = [];
    var price = 0;
    var retail_price = 0;
    that.data.storeList.forEach(function (item) {
      // console.log(item.goods_name);
      if (item.checked) {
        price += item.trade_price * item.check_number;
        retail_price += item.retail_price * item.check_number;
        storeList.push(item);
      }
    });
    var order_taxi = {
      // store_house_id: that.data.storeList[0].store_house_id,
      goods_price: price,
      // order_price:app.globalData.pay_test?0.01: price,
      order_price:price,
      retail_price: retail_price,
      user_id: userInfo.id,
      user_name: userInfo.username,
      user_mobile: userInfo.mobile,
      sale_id: saleInfo.id,
      sale_name: saleInfo.username,
      sale_mobile: saleInfo.mobile
    };
    var data = {
      storeList: storeList,
      userInfo: userInfo,
      saleInfo:saleInfo,
      order_taxi: order_taxi
    };
    util.request(api.OrderTaxiAdd, data, 'POST').then(res => {
      if (res.errno == 0) {
        console.log(res);
        // const payParam = res.data;
        const payParam = res.data.payParam;
        const orderInfo = res.data.orderInfo;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log(res);
            console.log('pay success'); 
            util.request(api.OrderTaxiStatus, {id:orderInfo.id}).then(res => {
              console.log('更新支付状态成功'); 

            });
            // resolve(res);
          },
          'fail': function (res) {
            console.log('pay faild'); //支付失败，取消订单
            util.request(api.OrderTaxiCancel, { id: orderInfo.id }).then(res => {
              if(res.errno==0)
                console.log('支付失败，取消订单');
              console.log(res);
            });
            // reject(res);
          },
          'complete': function (res) {
            console.log(res);
            console.log('pay complete');
            // reject(res);
          }
        });

      } else {

      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      urlPrefix: api.HOST
    });
    // // var scene = wx.getStorageSync('scene');
    // var scene = app.globalData.scene;
    // if (scene != 'undefined')
    //     this.handScene(scene);
    if(app.globalData.scene_type=="sal")
      this.getStoreSale();
  },
  getStoreSale:function(){

    let that = this;
    util.request(api.StoreSale,{mobile:app.globalData.scene}).then(res => {
      console.log(res);
      res.data.storeList.forEach(function (item) {
        item.imgUrl = util.bindImgUrl(item.list_pic_url);
        console.log(item.goods_name);
        item.checked = false;
        item.check_number = 0;
      });
      that.setData({
        storeList: res.data.storeList,
        // saleInfo: res.data.saleInfo
        // storeSale: res.data.storeSale
      });
      app.globalData.saleInfo = res.data.saleInfo;
    });
  },
  test: function () {
    util.request(api.Z_Test).then(res => {
      console.log(res);
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var a=0;
    // this.test();
    // return;
    // if (app.globalData.userInfo.authorize<9) {
    // wx.navigateTo({
    //   url: '../../pages/ucenter/auth/login',
    // });
    //   return;
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
});