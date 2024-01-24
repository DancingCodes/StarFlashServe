const express = require('express');

const User = require('../../mongoDB/user')
const Article = require('../../mongoDB/article')

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
        await User.create({
            userName: req.body.userName,
            userAccount: req.body.userAccount,
            userPassword: req.body.userPassword,
            userPcture: req.body.userPcture,
            userId: id,
            collectArticleIdList: []
        })

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
    const user = await User.findOne({ userId: req.auth.userId }, { _id: 0, __v: 0, userPassword: 0, collectArticleIdList: 0 }).lean()

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
    const list = await Article.find({ userId: req.auth.userId }, { _id: 0, __v: 0 }).skip((req.query.pageNo - 1) * req.query.pageSize).limit(req.query.pageSize).lean()
    const total = await Article.find({}).count()

    // 查找用户
    const user = await User.findOne({ userId: req.auth.userId })
    for (let i = 0; i < list.length; i++) {
        // 设置文章作者信息
        list[i].userName = user.userName
        list[i].userPcture = user.userPcture

        // 设置用户是否收藏
        if (user.collectArticleIdList.includes(list[i].articleId)) {
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
    const user = await User.findOne({ userId: req.auth.userId })
    const list = await Article.find({ articleId: user.collectArticleIdList }, { _id: 0, __v: 0 }).skip((req.query.pageNo - 1) * req.query.pageSize).limit(req.query.pageSize).lean()
    const total = await Article.find({ articleId: user.collectArticleIdList }).count()


    for (let i = 0; i < list.length; i++) {
        // 查找用户
        const author = await User.findOne({ userId: list[i].userId })
        // 设置文章作者信息
        list[i].userName = author.userName
        list[i].userPcture = author.userPcture

        // 设置用户是否收藏
        list[i].isCollect = true
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
    const { collectArticleIdList } = await User.findOne({ userId: req.auth.userId })
    if (!collectArticleIdList.includes(req.body.articleId)) {
        collectArticleIdList.push(req.body.articleId)
        await User.findOneAndUpdate({ userId: req.auth.userId }, {
            $set: { collectArticleIdList: collectArticleIdList }
        })
    }
    res.send({
        code: 200,
    })
})

// 取消收藏文章
router.put('/user/cancelCollectArticle', async (req, res) => {
    let { collectArticleIdList } = await User.findOne({ userId: req.auth.userId })
    if (collectArticleIdList.includes(req.body.articleId)) {
        collectArticleIdList = collectArticleIdList.filter(item => item !== req.body.articleId)
        await User.findOneAndUpdate({ userId: req.auth.userId }, {
            $set: { collectArticleIdList: collectArticleIdList }
        })
    }
    res.send({
        code: 200,
    })
})

// 导出路由模块
module.exports = router;