// default config
module.exports = {
  // 可以公开访问的Controller
  publicController: [
    // 格式为controller
    'index',
    'catalog',
    'topic',
    'auth',
    'goods',
    'brand',
    'search',
    'region',
    'store',
    'z_test',
    'user',
    'sale'
  ],

  // 可以公开访问的Action
  publicAction: [
    // 格式为： controller+action
    'comment/list',
    'comment/count',
    'cart/index',
    'cart/add',
    'cart/checked',
    'cart/update',
    'cart/delete',
    'cart/goodscount',
    'pay/notify',
    'store/index',
    'z_test/test',
    'user/info'
  ]
};
