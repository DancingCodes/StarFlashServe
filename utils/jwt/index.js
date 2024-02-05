// 引入serve
const expressServe = require('../../serve')

// 引入JWT
const { expressjwt } = require('express-jwt');
module.exports = secretKey = 'StarFlash';
// JWT还原JSON,使用req.user获取用户信息
expressServe.use(expressjwt({ secret: secretKey, algorithms: ['HS256'] }))

// 捕获解析JWT失败错误,Token字符串过期或不合法会解析失败
expressServe.use((err, req, res, next) => {
    // jwt白名单接口
    const jwtWhiteApiList = ['/user/signUp', '/user/login', '/uploadFile/uploadImage', '/article/getArticleList']
    const isNext = jwtWhiteApiList.some((item)=> req.originalUrl.includes(item))
    if (isNext) {
        return next()
    }
    // 静态文件不限制
    if (req.originalUrl.includes('/images')) {
        return next()
    }
    // token错误
    if (err.name === 'UnauthorizedError') {
        return res.send({ code: 401 })
    }
    res.send({
        statusCode: 500,
        message: '未知错误'
    })
})