const axios = require('axios');
const fs = require('fs');
const long = require('./long');


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
    wstream.on('error', (err) => {
      reject(err);
    });
    wstream.on('finish', () => {
      resolve(true);
    });
  });
}
module.exports = {
  createQr: function (width, urlToken, urlWxCode, appid, secret, scene, page, path) {
    // console.log('test');
    var access_token = null;
    var url1 = urlToken + "?grant_type=client_credential&appid=" + appid + "&secret=" + secret;
    // axios.get(urlToken, data2).then(function (response) {
    axios.get(url1).then(function (res) {
      access_token = res.data.access_token;
      // console.log(res);
      if (res.data.access_token) {
        // console.log(res.data.access_token);
        var url2 = urlWxCode + access_token;
        var post = {
          "scene": scene,
          "page": page,
          "width": width
          // "width": 430
        };
        var headers = {
          "responseType": "arraybuffer"
          // }
        };
        axios.post(url2, post, headers).then(function (res) {
          if (res.data.errcode) {
            console.log('二维码 errcode ');
            console.log(res);
            return;
          }
          if (res.headers["content-type"] != 'image/jpeg') {
            console.log(res);
            console.log('二维码 Content-Type，image\/jpeg');
            console.log(res.data.length + '     len ..bytelen        ' + res.data.byteLength);
            return;
          }
          console.log(res);
          console.log(res.data.length + '   -len ..bytelen->' + res.data.byteLength);
          //存为文件
          saveFile(path, res.data);
          //转为base64显示
          // const base64 = wx.arrayBufferToBase64(res.data);

        }).catch(function (err) {
          think.logger.error(err);
          console.log(err);

        });

      }

    }).catch(function (err) {
      think.logger.error(err);
      console.log(err);
    });
  }
}