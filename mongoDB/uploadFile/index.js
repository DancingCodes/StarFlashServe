// 引入mongoose模块
const mongoose = require('mongoose');

// 创建图片上传集合规则
const uploadFileSchema = new mongoose.Schema({
    fileUrl: String,
})

// 创建集合
const UploadFile = mongoose.model('UploadFile', uploadFileSchema);

// 创建初始图片上传
// UploadFile.create({
//     fileUrl: 'https://obs-sdjn.cucloud.cn/village/vil/2023/04/27/1498185a-3784-4e01-93c7-3acbe1fd2198.jpg',
// })

module.exports = UploadFile