const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: [true, '信箱為必填']
    },
    password: {
      type: String,
      trim: true,
      required: [true, '密碼為必填'],
      select: false,
    },
    photo: {
      type: String,
      trim: true,
      required: [true, '使用者圖片未選擇'],
    },
    nickname: {
      type: String,
      default: '新用戶'
    },
    gender: {
      type: String,
      enum: ['男性', '女性'],
      default: '女性'
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;