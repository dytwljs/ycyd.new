// pages/qrcode/index.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../services/user.js');
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        storeList: [],
        storeSale: {},
        isEditCart: true,
    },
    handScene: function (scene) {

        let that = this;
        util.request(api.StoreSale, {
            id: scene
        }, 'POST').then(function (res) {
            if (res.errno === 0) {
                console.log(res.data);
                that.setData({
                    //storeList: res.data.storeList,
                    storeSale: res.data.storeSale
                });
                res.data.storeList.forEach(function (e) {
                    var store = that.data.storeList.find((st) => {
                        if (st.id == e.id)
                            return st;
                    });
                    if (store)
                        e.checked = store.checked;
                    // e.checked=e.id==that.data.storeSale[0].id?true:false;
                    if (e.id == that.data.storeSale[0].id)
                        e.checked = true;
                });
                that.setData({
                    storeList: res.data.storeList
                });
            }
        });
    },
    handEan: function (ean_code) {
        let that = this;
        util.request(api.StoreEan, {
            ean_code: ean_code
        }, 'POST').then(function (res) {
            if (res.errno === 0) {
                console.log(res.data);
                // that.setData({
                //     //storeList: res.data.storeList,
                //     storeSale: res.data.storeSale
                // });
                // res.data.storeList.forEach(function(e){
                //     e.checked=e.id==that.data.storeSale[0].id?true:false;
                // });
                // // if(that.data.storeList.length==0)
                //     that.setData({
                //         storeList: res.data.storeList});
            }
        });
    },
    scan: function (e) {
        let that = this;
        // 允许从相机和相册扫码
        wx.scanCode({
            success: (res) => {
                console.log(res.result)
                if (res.errMsg != 'scanCode:ok') {
                    console.log(res.errMsg)
                    return;
                }
                if (res.scanType == 'QR_CODE') {
                    //result: "http://www.benseds.com"
                }
                if (res.scanType == 'WX_CODE') {
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
                if (res.scanType == 'EAN_13') {
                    // result: "6901028183222"
                    handEan(result);
                }
            },
            fail: (err) => {
                console.log(err)
            },
            complete: (res) => {
                //       console.log(res)

            }
        })
    },
    getScene: function (path) {
        // var res = { path: 'pages/index/index?scene=832bb850-2162-4e42-7060796a2fb8' };
        var scene = null;
        if (path.indexOf('?') != -1) {
            var param = path.split('?');
            if (param[1] && param[1].indexOf('=') != -1) {
                scene = param[1].split('=')[1];
            }
        }
        return scene;
    },
    toClient:function(){
        wx.navigateToMiniProgram({
            appId: 'wx1ca22e3163a07ec6',
            path: 'pages/category/category',
            extraData: {
              foo: 'bar'
            },
            envVersion: 'develop',
            success(res) {
              // 打开成功
            }
          })
    },

    checkedItem: function (event) {
        let itemIndex = event.target.dataset.itemIndex;
        let that = this;

        // if (!this.data.isEditCart) {
        //   util.request(api.CartChecked, { productIds: that.data.cartGoods[itemIndex].product_id, isChecked: that.data.cartGoods[itemIndex].checked ? 0 : 1 }, 'POST').then(function (res) {
        //     if (res.errno === 0) {
        //       console.log(res.data);
        //       that.setData({
        //         cartGoods: res.data.cartList,
        //         cartTotal: res.data.cartTotal
        //       });
        //     }

        //     that.setData({
        //       checkedAllStatus: that.isCheckedAll()
        //     });
        //   });
        // } else {
        //   //编辑状态
        //   let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
        //     if (index == itemIndex){
        //       element.checked = !element.checked;
        //     }

        //     return element;
        //   });

        //   that.setData({
        //     cartGoods: tmpCartData,
        //     checkedAllStatus: that.isCheckedAll(),
        //     'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
        //   });
        // }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // var scene = wx.getStorageSync('scene');
        var scene = app.globalData.scene;
        if (scene != 'undefined')
            this.handScene(scene);
    },
    test:function(){
        util.request(api.Z_Test).then(res=>{
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

        this.test();
        return;
        if (app.globalData.userInfo.authorize<9) {
        wx.navigateTo({
          url: '../../pages/ucenter/auth/login',
        });
        return;
      }

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

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