// 引入mongoose模块
const mongoose = require('mongoose');

// 创建用户集合规则

const articleSchema = new mongoose.Schema({
    articleContent: String,
    authorId: String,
    articleId: String,
    createTime: String,
})

// 创建集合
const Article = mongoose.model('Article', articleSchema);


// 创建初始文章
// Article.create({
//     articleContent: 'articleContent',
//     articleId: '1',
//     authorId: '1',
//     createTime: '2000-12-27 12:00:00'
// })

module.exports = Article