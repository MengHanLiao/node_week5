const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      require: [true, '貼文內容為必填']
    },
    image: {
      type: String,
      trim: true,
      default: ''
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: ['true', '貼文 id 為必填']
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      }
    ]
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const postsModel = mongoose.model('Post', postsSchema);

module.exports = postsModel;