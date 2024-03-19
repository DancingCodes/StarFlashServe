const express = require('express');

const UploadFile = require('../../mongoDB/uploadFile')

const router = express.Router();

const { v4 } = require('uuid');
const multer = require("multer");

const fs = require("fs");

// 图片保存路径
const localPath = require('../../public/localPath')


// 设置文件存储路径
const FileLoadUrl = './uploadFile';
// 没有文件夹时先创建
if (!fs.existsSync(FileLoadUrl)) {
    fs.mkdirSync(FileLoadUrl)
}
// 设置图片存储路径
const imageLoadUrl = './uploadFile/images';
if (!fs.existsSync(imageLoadUrl)) {
    fs.mkdirSync(imageLoadUrl)
}

// 设置图片存储路径
const storage = multer.diskStorage({
    // 文件保存位置
    destination: (_req, _file, cb) => {
        cb(null, imageLoadUrl);
    },
    // 保存的文件名称
    filename: async (_req, file, cb) => {
        const id = v4()
        // 文件后缀
        const suffix = file.originalname.substring(file.originalname.lastIndexOf("."));
        // 保存图片
        await UploadFile.create({
            fileUrl: `${localPath}/images/${id}${suffix}`,
        })
        cb(null, `${id}${suffix}`)
    }
})
// 添加配置文件到muler对象
const upload = multer({ storage: storage });

// 图片上传
router.post('/uploadFile/uploadImage', upload.single('file'), (req, res) => {
    res.send({
        code: 200,
        data: {
            fileUrl: `${localPath}/images/${req.file.filename}`,
        }
    })
})



// 导出路由模块
module.exports = router;