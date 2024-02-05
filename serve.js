// 引入express
const express = require('express');
// 创建web服务器
const expressServe = express();
let serve = null
if (process.env.NODE_ENV === 'development') {
    // 本地
    const http = require('http')
    serve = http.createServer(expressServe).listen(require('./public/prot'), () => {
        console.log('服务器启动成功啦( ≖ ◡ ≖✿ )')
    });
} else {
    // 线上
    const https = require('https')
    serve = https.createServer({
        key: fs.readFileSync('./static/ssl/api.moonc.love.key'),
        cert: fs.readFileSync('./static/ssl/api.moonc.love.crt')
    }, expressServe).listen(require('./public/prot'), () => {
        console.log('服务器启动成功啦( ≖ ◡ ≖✿ )')
    });
}


module.exports = serve

// 链接数据库
require('./mongoDB')

// 加载路由
require('./router')

// 加载工具
require('./utils')