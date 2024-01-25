// 引入mongoose模块
const mongoose = require('mongoose');

// 创建文章消息规则
const articleMessageSchema = new mongoose.Schema({
    userId: String,
    content: String,
    articleId: String,
    createTime: String,
    isNew: Boolean
})

// 创建集合
const ArticleMessage = mongoose.model('ArticleMessage', articleMessageSchema);

// // 创建初始文章消息
// ArticleMessage.create({
//     userId: '1',
//     articleId: '1',
//     action: '收藏了您的文章',
//     createTime: '2000-12-27 12:00:00',
//     isNew: true
// })

module.exports = ArticleMessage