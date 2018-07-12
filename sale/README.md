

登录流程候改。
原  
一，app.js 
1,user.checkLogin
            if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')
                util.checkSession()

2,this.globalData.userInfo = wx.getStorageSync('userInfo');
      this.globalData.token = wx.getStorageSync('token');
二，auth/login.js
1，user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo

      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;

三，users.
    util.login().then((res) => {
      code = res.code;
      return util.getUserInfo();
    }).then((userInfo) => {
      //登录远程服务器
      util.request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST').then(res => {
        if (res.errno === 0) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo);
          wx.setStorageSync('token', res.data.token);
现有流程
一，判断
