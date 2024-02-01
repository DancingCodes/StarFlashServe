// 本地IP路径
let localPath = null
// 本地
if (process.env.NODE_ENV === 'development') {
    localPath = `http://localhost:${require('../prot')}`
} else {
    // 线上
    localPath = `http://api.moonc.love:${require('../prot')}`
}

module.exports = localPath