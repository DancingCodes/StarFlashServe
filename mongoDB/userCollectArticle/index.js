// 引入mongoose模块
const mongoose = require('mongoose');

// 创建用户收藏文章规则
const userCollectArticleSchema = new mongoose.Schema({
    userId: String,
    collectList: Array
})

// 创建集合
const UserCollectArticle = mongoose.model('UserCollectArticle', userCollectArticleSchema);

// // 创建用户收藏文章
// UserCollectArticle.create({
//     userId: '1',
//     collectList: [{
//         articleId: '1',
//         createTime: '2000-12-27 10:00:00'
//     }]
// })

module.exports = UserCollectArticle