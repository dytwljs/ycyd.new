const axios = require('axios');
var fs = require('fs');
var long = require('./long');
var data = {
    pic: null,
  //  path: 'c:/temp/',
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


// // var sce = String(97574194493047655);
// //   test(data.urlToken, data.urlWxCode, data.appid, data.secret, sce + i, data.page2);
// //test(data.urlToken, data.urlWxCode, data.appid, data.secret, data.scene, data.page2);
// // scan();
// // function scan() {
// //     var res = { path: 'pages/index/index?scene=832bb850-2162-4e42-7060796a2fb8' };
// //     var scene = null;
// //     if (res.path.indexOf('?') != -1) {
// //         var param = res.path.substring(1).split('?');
// //         var param1 = res.path.split('?');
// //         if (param[1] && param[1].indexOf('=') != -1) {
// //             scene = param[1].split('=')[1];
// //         }
// //     }
// // }

// var sce = '97574194493047654';
// for (i = 0; i < 20; i++) {
//     sce = long.jia(sce, 1);
//     console.log(sce);
//     test(data.urlToken, data.urlWxCode, data.appid, data.secret, sce, data.page1);
// }

function test(urlToken, urlWxCode, appid, secret, scene, page, isArrayBuffer = true) {
    console.log(data.appid);
    var access_token = null;
    var url1 = urlToken + "?grant_type=client_credential&appid=" + appid + "&secret=" + secret;
    // axios.get(urlToken, data2).then(function (response) {
    axios.get(url1).then(function(res) {
        access_token = res.data.access_token;
        // console.log(res);
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
                var path = data.path + scene + '.jpg';
                //存为文件
                saveFile(path, res.data);
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