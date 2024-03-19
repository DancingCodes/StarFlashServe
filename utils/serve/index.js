// 引入serve
const expressServe = require('../../serve')
const fs = require('fs')
let serve = null
if (process.env.NODE_ENV !== 'development') {
    // 本地
    const http = require('http')
    serve = http.createServer(expressServe).listen(require('../../public/prot'), () => {
        console.log('Http服务器启动成功啦( ≖ ◡ ≖✿ )')
    });
} else {
    // 线上
    const https = require('https')
    serve = https.createServer({
        key: fs.readFileSync('./static/ssl/api.moonc.love.key'),
        cert: fs.readFileSync('./static/ssl/api.moonc.love_bundle.crt')
    }, expressServe).listen(require('../../public/prot'), () => {
        console.log('Https服务器启动成功啦( ≖ ◡ ≖✿ )')
    });
}