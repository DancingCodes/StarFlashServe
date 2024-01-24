// 引入mongoose模块
const mongoose = require('mongoose');

// 创建用户集合规则
const userSchema = new mongoose.Schema({
    userName: String,
    userAccount: String,
    userPassword: String,
    userPcture: String,
    userId: String,
    collectArticleIdList: Array
})

// 创建集合
const User = mongoose.model('User', userSchema);

// // 创建初始用户
// User.create({
//     userName: '张一兜',
//     userAccount: 'admin',
//     userPassword: '123456',
//     userPcture: 'https://obs-sdjn.cucloud.cn/village/vil/2023/04/27/1498185a-3784-4e01-93c7-3acbe1fd2198.jpg',
//     userId: '1',
//     collectArticleIdList: []
// })

module.exports = User