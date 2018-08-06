/**
 * 用户相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');

/**
 * 调用微信登录 old
 */
function loginByWeixin() {

  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code;
      return util.getUserInfo();
    }).then((userInfo) => {
      //登录远程服务器
      util.request(api.AuthLoginByWeixin, {
        code: code,
        userInfo: userInfo
      }, 'POST').then(res => {
        if (res.errno === 0) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo);
          wx.setStorageSync('token', res.data.token);

          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

function loginByWeixin(userInfo, userType) {

  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code;
      return userInfo;
    }).then((userInfo) => {
      //登录远程服务器
      util.request(api.AuthLoginByWeixin, {
        code: code,
        userInfo: userInfo,
        userType: userType
      }, 'POST').then(res => {
        if (res.errno === 0) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo);
          wx.setStorageSync('token', res.data.token);

          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

function getPhone(detail,userType) {
  return new Promise(function (resolve, reject) {
    return util.request(api.GetPhone, {
      detail: detail,
      token: wx.getStorageSync('token')
      ,userType:userType
    }, 'POST').then(res => {
      if (res.errno == 0) {
        //存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo);
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err)=>{
      reject(err);

    })
  });
}

function getPhoneWithLogin(detail,userType){
  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((r) => {
      code = r.code;
      // return detail;
    }).then((de) => {
      return util.request(api.GetPhone, {
        detail: detail
        ,code :code
        ,userType:userType
      }, 'POST').then(res => {
        if (res.errno == 0) {
          //存储用户信息
            wx.setStorageSync('userInfo', res.data.userInfo);
            wx.setStorageSync('token', res.data.token);
          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err)=>{
        reject(err);
  
      })
    })
    .catch((err) => {
      reject(err);
    })
  
  });
  
}

// function loginByWeixin() {

//   let code = null;
//   return new Promise(function (resolve, reject) {
//     return util.login().then((res) => {
//       code = res.code;
//       return util.getUserInfo();
//     }).then((userInfo) => {
//       //登录远程服务器
//       util.request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST').then(res => {
//         if (res.errno === 0) {
//           //存储用户信息
//           wx.setStorageSync('userInfo', res.data.userInfo);
//           wx.setStorageSync('token', res.data.token);

//           resolve(res);
//         } else {
//           reject(res);
//         }
//       }).catch((err) => {
//         reject(err);
//       });
//     }).catch((err) => {
//       reject(err);
//     })
//   });
// }

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      util.checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });

    } else {
      reject(false);
    }
  });
}

function SaleInfo(id){
  return new Promise(function (resolve, reject) {
    return util.request(api.SaleInfo).then(res => {
      if (res.errno == 0) {
        //存储用户信息
          wx.setStorageSync('userInfo', res.data.saleInfo);
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err)=>{
      reject(err);

    })
  });
}

function getSaleInfo(mobile) {
  return new Promise(function (resolve, reject) {
    return util.request(api.GetSaleInfo, { mobile: mobile}).then(res => {
      if (res.errno == 0) {
        //存储用户信息
        //wx.setStorageSync('userInfo', res.data.saleInfo);
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err);

    })
  });
}
function getUserInfo(id){
  return new Promise(function (resolve, reject) {
    return util.request(api.GetUserInfo).then(res => {
      if (res.errno == 0) {
        //存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo);
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err)=>{
      reject(err);

    })
  });
}

function isLogin(){
  wx.getUserInfo({
    withCredentials: true,
    success: function (res) {
      //此处为获取微信信息后的业务方法
    },
    fail: function () {
      //获取用户信息失败后。请跳转授权页面
      wx.showModal({
        title: '警告',
        content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '../ucenter/login',
            })
          }
        }
      })
    }
  })
}

module.exports = {
  isLogin,
  loginByWeixin,
  checkLogin,
  getPhone,
  getPhoneWithLogin,
  getUserInfo,
  getSaleInfo
};