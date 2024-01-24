// 引入serve
const serve = require('../serve')
// 引入express
const express = require('express');

// 引入jwt
require('../utils/jwt')

// 获取URL-encoded格式的请求数据（psot接受的请求数据）（必须配置在路由之前）
serve.use(express.urlencoded({ extended: false }))
serve.use(express.json())

// 导入路由模块
const user = require('./user')
const uploadFile = require('./uploadFile')
const article = require('./article')


// 注册路由模块
serve.use(user);
serve.use(uploadFile);
serve.use(article);
