// 引入express
const express = require('express');

// 创建web服务器
const app = express();
module.exports = app

// 链接数据库
require('./mongoDB')

// 加载路由
require('./router')

// 加载工具
require('./utils')