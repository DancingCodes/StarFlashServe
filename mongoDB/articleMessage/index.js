// 引入mongoose模块
const mongoose = require('mongoose');

// 创建文章消息规则
const articleMessageSchema = new mongoose.Schema({
    userId: String,
    messageList: Array
})

// 创建集合
const ArticleMessage = mongoose.model('ArticleMessage', articleMessageSchema);

// // 创建初始文章消息
// ArticleMessage.create({
//     userId: '1',
//     messageList: [{
//         // 发起人
//         userId: '2',
//         // 行为
//         content: '收藏了您的文章',
//         // 目标
//         articleId: '1',
//         // 什么时候干的
//         createTime: '2022-12-27 12:00:00',
//         // 是否是新消息
//         isNew: true
//     }]
// })

module.exports = ArticleMessage