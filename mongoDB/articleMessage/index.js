// 引入mongoose模块
const mongoose = require('mongoose');

// 创建文章消息规则
const articleMessageSchema = new mongoose.Schema({
    initiator: String,
    receiver: String,
    content: String,
    articleId: String,
    createTime: String,
    isNew: Boolean
})

// 创建集合
const ArticleMessage = mongoose.model('ArticleMessage', articleMessageSchema);

// // 创建初始文章消息
// ArticleMessage.create({
//     initiator: '1',
//     receiver: '2',
//     content: '收藏了您的文章',
//     articleId: '1',
//     createTime: '2000-12-27 12:00:00',
//     isNew: true
// })

module.exports = ArticleMessage