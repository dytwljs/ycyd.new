module.exports = {
    ERRORS: {

        // 数据库错误
        DBERR: {
            ERR_INSERT_SUCCESS_CODE: '101',
            ERR_INSERT_SUCCESS_MSG:'插入数据库错误',
            ERR_INSERT_ERR_CODE: '102',
            ERR_INSERT_ERR_MSG:'新增数据出错',
            ERR_INSERT_EXIST_CODE: '103',
            ERR_INSERT_EXIST_MSG:'新增数据出错,ID重复'
        }
    },

    LOGIN_STATE: {
        SUCCESS: 1,  // 登陆成功
        FAILED: 0    // 登录失败
    }
}