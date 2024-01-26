const express = require('express');

const Article = require('../../mongoDB/article')
const User = require('../../mongoDB/user')
const UserCollectArticle = require('../../mongoDB/UserCollectArticle')


const { v4 } = require('uuid');

const moment = require('moment')

const router = express.Router();

const localPath = require('../../public/localPath')
// 获取文章列表
router.get('/article/getArticleList', async (req, res) => {
    const list = await Article.find({}, { _id: 0, __v: 0 }).sort({ createTime: -1 }).skip((req.query.pageNo - 1) * req.query.pageSize).limit(req.query.pageSize).lean()
    const total = await Article.find({}).count()

    // 为列表添加用户信息
    const user = await User.findOne({ userId: req.auth?.userId })

    for (let i = 0; i < list.length; i++) {
        // 设置文章作者信息
        const author = await User.findOne({ userId: list[i].authorId })
        if (author) {
            list[i].userName = author.userName
            list[i].userPcture = author.userPcture
        } else {
            list[i].userName = '用户已注销'
            list[i].userPcture = `${localPath}/images/loggeOffUser.png`
        }

        // 设置用户是否收藏
        if (user) {
            const collectArticle = await UserCollectArticle.findOne({ userId: user.userId, articleId: list[i].articleId })
            if (collectArticle) {
                list[i].isCollect = true
            } else {
                list[i].isCollect = false
            }
        } else {
            list[i].isCollect = false
        }
    }

    res.send({
        code: 200,
        data: {
            list, total
        }
    })
})

// 创建文章
router.post('/article/writeArticle', async (req, res) => {
    await new Article({
        articleContent: req.body.articleContent,
        authorId: req.auth.userId,
        articleId: v4(),
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    }).save()
    res.send({
        code: 200,
    })
})

// 获取文章
router.get('/article/getArticle', async (req, res) => {
    const article = await Article.findOne({ articleId: req.query.articleId }, { _id: 0, __v: 0 })
    res.send({
        code: 200,
        data: article
    })
})

// 修改文章
router.put('/article/modifyArticle', async (req, res) => {
    await Article.findOneAndUpdate({ articleId: req.body.articleId }, {
        $set: { articleContent: req.body.articleContent }
    })
    res.send({
        code: 200,
    })
})

// 删除文章
router.delete('/article/removeArticle', async (req, res) => {
    await Article.deleteOne({ articleId: req.query.articleId })
    res.send({
        code: 200,
    })
})


module.exports = router;