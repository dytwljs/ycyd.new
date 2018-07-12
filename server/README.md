### ycyd商城（服务端）

+ 
+ 测试数据采集商城
+ 功能和数据库参考ecshop
+ 服务端api基于Ｎode.js+ThinkJS+MySQL
+ 计划添加基于Vue.js的后台管理系统、PC版、Ｗap版


### 本地开发环境配置
+ 克隆项目到本地
```
```
+ 创建数据库ycyd并导入项目根目录下的ycyd.sql
```
CREATE SCHEMA `ycyd` DEFAULT CHARACTER SET utf8mb4 ;
```
> 注意数据库字符编码为utf8mb4 
+ 更改数据库配置
  src/common/config/database.js
  
```
const mysql = require('think-model-mysql');

module.exports = {
    handle: mysql,
    database: 'ycyd',
    prefix: 'yc_',
    encoding: 'utf8mb4',
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '你的密码',
    dateStrings: true
};
```

+ 填写微信登录和微信支付配置
src/common/config/config.js
```
// default config
module.exports = {
  default_module: 'api',
  weixin: {
    appid: '', // 小程序 appid
    secret: '', // 小程序密钥
    mch_id: '', // 商户帐号ID
    partner_key: '', // 微信支付密钥
    notify_url: '' // 微信异步通知，例：https://www.ycyd.com/api/pay/notify
  }
};
```

+ 安装依赖并启动
```
npm install
npm start
```
访问http://127.0.0.1:8360/

安装配置 pm2
npm install -g pm2
修改项目根目录下的 pm2.json 为：

vim pm2.json
修改后的内容如下 ：

{
  "apps": [{
    "name": "ycyd",
    "script": "production.js",
    "cwd": "/var/www/ycyd",
    "exec_mode": "fork",
    "max_memory_restart": "256M",
    "autorestart": true,
    "node_args": [],
    "args": [],
    "env": {

    }
  }]
}
如果服务器配置较高，可适当调整 max_memory_restart 和instances的值

启动pm2

pm2 start pm2.json
成功启动

image.png
再次验证是否可以访问

curl -I http://127.0.0.1:8360/


### 线上部署

+ 没有域名部署参考文档：[不用买域名、不用备案、不用配置https快速部署Node.js微信小程序商城（基于Node.js+MySQL+ThinkJS）](http://www.jianshu.com/p/78a0f5f424e1)

+ 如有域名且已备案，可参考：
  + [阿里云 Ubuntu 16.04 下部署 Node.js + MySQL 微信小程序商城](http://www.jianshu.com/p/38d13a7c1b78)
  + [阿里云 CentOS 7.3 下部署基于 Node.js + MySQL 的微信小程序商城](http://www.jianshu.com/p/5d5497697b0a)


### 微信小程序客户端截图

![首页](http://upload-images.jianshu.io/upload_images/3985656-c543b937ac6e79bb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/320)

![专题](http://upload-images.jianshu.io/upload_images/3985656-bd606aac3b5491c2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/320)

![分类](http://upload-images.jianshu.io/upload_images/3985656-fa9565158376d439.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/320)

![商品列表](http://upload-images.jianshu.io/upload_images/3985656-788b7fd2c4a558d0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/320)

![商品详情](http://upload-images.jianshu.io/upload_images/3985656-99a6e0a57778d85f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/320)

![购物车](http://upload-images.jianshu.io/upload_images/3985656-60ff2307d81f6bb2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/320)

![订单中心](http://upload-images.jianshu.io/upload_images/3985656-dff837e6b2ec87b3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/320)


### 功能列表
+ 首页
+ 分类首页、分类商品、新品首发、人气推荐商品页面
+ 商品详情页面，包含加入购物车、收藏商品、商品评论功能
+ 搜索功能
+ 专题功能
+ 品牌功能
+ 完整的购物流程，商品的加入、编辑、删除、批量选择，收货地址的选择，下单支付
+ 会员中心（订单、收藏、足迹、收货地址、意见反馈）
....

### 最后
+ 喜欢别忘了 Star
+ 微信号 tumobi
+ 交流 QQ 群：497145766

service nginx start
ginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)

解决办法
首先用
lsof －i :80    查看80端口被什么程序占用，返回结果如下，
COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME
nginx 3274 root 6u IPv4 10664 0t0 TCP :http (LISTEN)
nginx 3547 nginx 6u IPv4 10664 0t0 TCP :http (LISTEN)
.....
发现是nginx进程占用了80端口，所以我们把nginx进程kill掉，重新启动服务。
命令如下(kill 掉所有的nginx进程):
kill -9 lsof -i :80 |grep nginx |grep -v grep|awk '{print $2}'

pm2 start pm2.json

service nginx start

