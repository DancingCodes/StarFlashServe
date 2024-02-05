// 引入serve
const expressServe = require('../../serve')
// 引入express
const express = require('express');
// 引入path
const path = require('path')
const requestUrl = path.join(path.resolve(__dirname, '..', '..'), 'uploadFile', 'images')
const statictUrl = path.join(path.resolve(__dirname, '..', '..'), 'static', 'images')


// 开放图片访问权限，解决图片跨域
expressServe.use('/images', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// 开放用户上传图片
expressServe.use('/images', express.static(requestUrl));
// 开放本地静态图片
expressServe.use('/images', express.static(statictUrl));
