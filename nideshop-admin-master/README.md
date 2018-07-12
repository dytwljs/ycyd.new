# nideshop-admin
Node.js开源商城NideShop管理后台（基于Node.js、Vue.js、Element UI、~~Electron~~）
[Font Awesome](http://fontawesome.dashgame.com/)

### 测试版包含功能（待完善）
+ 管理员登录
+ 商品管理
+ 商品分类
+ 品牌管理
+ 会员管理
+ 订单管理

### Build Setup

+ 安装yc
[GitHub](https://github.com/Mrjingfu/nideshop)

+ 修改api地址
src/renderer/main.js
```
Axios.defaults.baseURL = 'http://127.0.0.1:8360/admin/';  # admin/ 不可删除
```
+ 运行
``` bash
# install dependencies
npm install

# 编译成 web ，编译成功后把 dist/web 下的文件上传的http服务器的根目录下
npm run build:web

```

# 测试账号
admin
admin888

### 最后,本程序在nideshop基础上完善的,原作者tumobi
喜欢别忘了Star 本项目长期更新完善，欢迎Watch, QQ群：418177552


---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[b31b441](https://github.com/SimulatedGREG/electron-vue/tree/b31b44123ad42acac12337c4955df4ead853f0df) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
