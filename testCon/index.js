const axios = require('axios');
var fs = require('fs');
var data = {
    pic: null,
    path:'/private/var/gedy/',
    // urlToken: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
    urlToken: 'https://api.weixin.qq.com/cgi-bin/token',
    urlWxCode: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=',
    appid: 'wx1ca22e3163a07ec6',
    secret: 'cb8040536dcc0afb7e3eca7bde0d5ecd',
    scene: "832bb850-2162-4e42-7060796a2fc9",
    // scene: "832bb850-2162-4e42-7060796a2fb8",
    page1: "pages/index/index",
    page2: "pages/ycyd/index",
    page3: "pages/z_test_rwm/index?id=333"
};

strSpace('2016060520103600466',5)
function strSpace(str,len){
    //var str = '2016060520103600466';
    var result=str.replace(/\s/g,'').replace(/(.{5})/g,"$1 ");
    console.log(result);   //2016 0605 2010 3600 466

}
//test(data.urlToken, data.urlWxCode, data.appid, data.secret, data.scene, data.page2);
// scan();
function scan() {
    var res = { path: 'pages/index/index?scene=832bb850-2162-4e42-7060796a2fb8' };
    var scene = null;
    if (res.path.indexOf('?') != -1) {
        var param = res.path.substring(1).split('?');
        var param1 = res.path.split('?');
        if (param[1] && param[1].indexOf('=') != -1) {
            scene = param[1].split('=')[1];
        }
    }
}

function test(urlToken, urlWxCode, appid, secret, scene, page, isArrayBuffer = true) {
    console.log(data.appid);
    var access_token = null;
    var url1 = urlToken + "?grant_type=client_credential&appid=" + appid + "&secret=" + secret;
    // axios.get(urlToken, data2).then(function (response) {
    axios.get(url1).then(function(res) {
        access_token = res.data.access_token;
        console.log(res);
        if (res.data.access_token) {
            console.log(res.data.access_token);
            var url2 = urlWxCode + access_token;
            var post = {
                "scene": scene,
                "page": page,
                "width": 430
            };
            var headers = {
                // headers:{
                // "Content-Type":"application/json",
                "responseType": "arraybuffer"
                    // }
            };
            axios.post(url2, post, headers).then(function(res) {
                if (res.data.errcode) {
                    console.log('二维码 errcode ');
                    console.log(res);
                    return;
                }
                if (res.headers["content-type"] != 'image/jpeg') {
                    console.log('二维码 Content-Type，image/jpeg');
                    console.log(res.data.length + '     len ..bytelen        ' + res.data.byteLength);
                    return;
                }
                console.log(res.data.length + 'len ..bytelen' + res.data.byteLength);
                //存为文件
                saveFile(data.path+data.scene+'.jpg', res.data);
                //转为base64显示
                // const base64 = wx.arrayBufferToBase64(res.data);

            }).catch(function(err) {
                console.log(err);

            });

        }

    }).catch(function(err) {
        console.log(err);
    });
}
/**
 * [saveFileWithStream description]
 * @param {String} filePath [文件路径]
 * @param {Buffer} readData [Buffer 数据]
 */
function saveFile(filePath, fileData) {
    return new Promise((resolve, reject) => {
        // 块方式写入文件
        const wstream = fs.createWriteStream(filePath);

        wstream.on('open', () => {
            const blockSize = 128;
            const nbBlocks = Math.ceil(fileData.length / (blockSize));
            for (let i = 0; i < nbBlocks; i += 1) {
                const currentBlock = fileData.slice(
                    blockSize * i,
                    Math.min(blockSize * (i + 1), fileData.length),
                );
                wstream.write(currentBlock);
            }

            wstream.end();
        });
        wstream.on('error', (err) => { reject(err); });
        wstream.on('finish', () => { resolve(true); });
    });
}
/**
 * 生成二维码
 * @param appid
 * @param secret
 * @param scent   传入参数
 * @param page    页面地址
 */
function test1(urlToken, urlWxCode, appid, secret, scene, page, isArrayBuffer = true) {
    var that = this;
    //https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
    //b类带参数返回
    //https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token==ACCESS_TOKEN
    //1,获取access_token
    var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type';
    var access_token = null;
    var data1 = {
        grant_type: 'client_credential',
        appid: appid,
        secret: secret
    };
    utils.request(url, data1, 'GET').then(function(res) {
        if (!res.access_token)
            return;
        access_token = res.access_token;
        //开发版本时可不带page参数，因为未发布
        var post = {
            "scene": scene,
            "page": page,
            "width": 430
        };
        //获取二维码
        var url1 = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + access_token;
        wx.request({
            url: url1,
            // data:JSON.stringify(post),
            data: post,
            method: 'POST',
            responseType: isArrayBuffer ? 'arraybuffer' : 'text',
            success: function(res) {
                if (res.data.errcode) {
                    console.log('二维码 errcode ');
                    console.log(res);
                    return;
                }
                if (res.header["Content-Type"] != 'image/jpeg') {
                    console.log('二维码 Content-Type，image/jpeg');
                    console.log(res);

                    console.log(res.data.length + '     len ..bytelen        ' + res.data.byteLength);
                    // console.log(res.data.byteLength);
                    return;
                }

                console.log(res.data.length + 'len ..bytelen' + res.data.byteLength);
                const base64 = wx.arrayBufferToBase64(res.data);
                that.setData({
                    pic: "data:image/png;base64," + base64
                });
            },
            faild: function(res) {
                console.log('二维码faild， ');
                console.log(res);

            }
        });
    });
}