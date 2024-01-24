// 引入express
const express = require('express');

// 创建web服务器
const serve = express();
module.exports = serve

// 链接数据库
require('./mongoDB')

// 加载路由
require('./router')

// 加载工具
require('./utils')

// 监听端口号
serve.listen(require('./public/prot'), () => {
    console.log('服务器启动成功啦( ≖ ◡ ≖✿ )')
})
