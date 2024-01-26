const express = require('express');

const User = require('../../mongoDB/user')
const Article = require('../../mongoDB/article')
const UserCollectArticle = require('../../mongoDB/UserCollectArticle')
const ArticleMessage = require('../../mongoDB/articleMessage')

const moment = require('moment')

const { v4 } = require('uuid');

const router = express.Router();

const jwt = require('jsonwebtoken');
const secretKey = require('../../utils/jwt');
// 注册
router.post('/user/signUp', async (req, res) => {
    const user = await User.findOne({ userAccount: req.body.userAccount })

    if (!user) {
        // 创建用户
        const id = v4()
        await new User({
            userName: req.body.userName,
            userAccount: req.body.userAccount,
            userPassword: req.body.userPassword,
            userPcture: req.body.userPcture,
            userId: id,
        }).save()

        // 设置token
        let token = jwt.sign({
            userAccount: req.body.userAccount,
            userId: id
        }, secretKey, { expiresIn: '1d' })

        res.send({
            code: 200,
            data: {
                token
            },
        })
    } else {
        res.send({ code: 500, message: '已经有这个用户啦 (⊙ˍ⊙) ' })
    }
})

// 登录
router.post('/user/login', async (req, res) => {
    const user = await User.findOne({ userAccount: req.body.userAccount })

    // 判断用户提交的登录信息是否正确
    if (user && req.body.userPassword === user.userPassword) {
        // 设置token
        let token = jwt.sign({
            userAccount: user.userAccount,
            userId: user.userId
        }, secretKey, { expiresIn: '1d' })
        res.send({
            code: 200,
            data: {
                token
            }
        })
    } else {
        res.send({
            code: 500,
            message: '输入的闪闪账号或密码有错误(⊙﹏⊙)',
        })
    }
})

// 注销
router.delete('/user/logoff', async (req, res) => {
    await User.findOneAndDelete({ userId: req.auth.userId })

    // 删除用户文章消息列表
    await ArticleMessage.findOneAndDelete({ userId: req.auth.userId })

    res.send({
        code: 200,
    })
})

// 修改
router.put('/user/modifyInfo', async (req, res) => {
    await User.findOneAndUpdate({ userId: req.auth.userId }, {
        $set: {
            userPcture: req.body.userPcture,
            userName: req.body.userName,
        }
    })
    res.send({
        code: 200,
    })
})

// 修改密码
router.put('/user/modifyPassword', async (req, res) => {
    const user = await User.findOne({ userId: req.auth.userId })
    if (user.userPassword === req.body.userPassword) {
        await User.findOneAndUpdate({ userId: user.userId }, {
            $set: {
                userPassword: req.body.newUserPassword,
            }
        })
        res.send({
            code: 200,
        })
    } else {
        res.send({
            code: 500,
            message: '密码错误'
        })
    }

})

// 获取用户信息
router.get('/user/info', async (req, res) => {
    const user = await User.findOne({ userId: req.auth.userId }, { _id: 0, __v: 0, userPassword: 0 }).lean()

    if (!user) {
        res.send({ code: 401 })
        return
    }

    res.send({
        code: 200,
        data: user,
    })
})

// 获取文章列表
router.get('/user/getArticleList', async (req, res) => {
    const list = await Article.find({ authorId: req.auth.userId }, { _id: 0, __v: 0 }).sort({ createTime: -1 }).skip((req.query.pageNo - 1) * req.query.pageSize).limit(req.query.pageSize).lean()
    const total = await Article.find({}).count()

    // 查找用户
    const user = await User.findOne({ userId: req.auth.userId })
    for (let i = 0; i < list.length; i++) {
        // 设置文章作者信息
        list[i].userName = user.userName
        list[i].userPcture = user.userPcture

        // 设置用户是否收藏
        const collectArticle = await UserCollectArticle.findOne({ userId: req.auth.userId, articleId: list[i].articleId })
        if (collectArticle) {
            list[i].isCollect = true
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

// 获取收藏文章列表
router.get('/user/getCollectArticleList', async (req, res) => {
    const collectArticleList = await UserCollectArticle.find({ userId: req.auth.userId }, { _id: 0, __v: 0 }).sort({ createTime: -1 }).skip((req.query.pageNo - 1) * req.query.pageSize).limit(req.query.pageSize).lean()
    const total = await UserCollectArticle.find({ userId: req.auth.userId }).count()
    const list = []

    for (let i = 0; i < collectArticleList.length; i++) {
        // 设置文章信息
        const article = await Article.findOne({ articleId: collectArticleList[i].articleId }, { _id: 0, __v: 0 }).lean()
        // 设置文章作者信息
        const author = await User.findOne({ userId: article.authorId })

        list.push({
            ...article,
            userName: author.userName,
            userPcture: author.userPcture,
            collectTime: collectArticleList[i].createTime,
            isCollect: true
        })
    }

    res.send({
        code: 200,
        data: {
            list, total
        }
    })
})

// 收藏文章
router.put('/user/collectArticle', async (req, res) => {
    const collectArticle = await UserCollectArticle.findOne({ userId: req.auth.userId, articleId: req.body.articleId })
    if (!collectArticle) {
        await new UserCollectArticle({
            userId: req.auth.userId,
            articleId: req.body.articleId,
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }).save()

        if (req.auth.userId !== req.body.authorId) {
            // 添加文章消息
            new ArticleMessage({
                initiator: req.auth.userId,
                receiver: req.body.authorId,
                content: '收藏了您的文章',
                articleId: req.body.articleId,
                createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                isNewMessage: true
            }).save()
        }

    }
    res.send({
        code: 200,
    })
})

// 取消收藏文章
router.put('/user/cancelCollectArticle', async (req, res) => {
    const collectArticle = await UserCollectArticle.findOne({ userId: req.auth.userId, articleId: req.body.articleId })
    if (collectArticle) {
        await UserCollectArticle.findOneAndDelete({ userId: req.auth.userId, articleId: req.body.articleId })

        if (req.auth.userId !== req.body.authorId) {
            // 添加文章消息
            new ArticleMessage({
                initiator: req.auth.userId,
                receiver: req.body.authorId,
                content: '取消收藏了您的文章',
                articleId: req.body.articleId,
                createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                isNewMessage: true
            }).save()
        }
    }
    res.send({
        code: 200,
    })
})

// 获取文章消息
router.get('/user/getArticleMessage', async (req, res) => {
    const articleMessageList = await ArticleMessage.find({ receiver: req.auth.userId }, { _id: 0, __v: 0 }).sort({ createTime: -1 }).skip((req.query.pageNo - 1) * req.query.pageSize).limit(req.query.pageSize).lean()
    const total = await ArticleMessage.find({ receiver: req.auth.userId }).count()
    const list = []

    for (let i = 0; i < articleMessageList.length; i++) {
        const user = await User.findOne({ userId: articleMessageList[i].initiator })
        const article = await Article.findOne({ articleId: articleMessageList[i].articleId })

        list.push({
            ...articleMessageList[i],
            initiatorName: user?.userName ?? '用户已注销',
            articleContent: article.articleContent
        })
    }

    res.send({
        code: 200,
        data: {
            list, total
        }
    })
})

// 导出路由模块
module.exports = router;