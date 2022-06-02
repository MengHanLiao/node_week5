const postsModel = require('../models/posts');
const userModel = require('../models/users');
const handleSuccess = require('../services/handleSuccess');
const appError = require('../services/appError');
const { findById } = require('../models/posts');

const postsController = {
  async isUserExist(req, res, next) {
    const isUserExist = await userModel.findById(req.body.userId);
    if(!req.body.userId || !isUserExist) {
      return next(new appError('使用者 id 未填寫或不存在'));
    }
    next();
  },
  async isPostExist(req, res, next) {
    const isPostExist = await postsModel.findById(req.params.postId);
    if(!req.params.postId || !isPostExist) {
      return next(new appError('貼文 id 未填寫或不存在'));
    }
    next();
  },
  async getAllPosts(req, res, next) {
    const keyword = req.query.q ? {content: new RegExp(req.query.q)} : {};
    const timeSort = req.query.sort === 'asc' ? "createdAt" : "-createdAt";
    const result = await postsModel.find(keyword).populate({
      path: 'user',
      select: '_id nickname photo'
    }).sort(timeSort);
    handleSuccess(res, result);
  },
  async addPost(req, res, next) {
    const { content, image, user } = req.body;
    if (!content?.trim()) {
      return next(new appError('貼文內容為必填'));
    }
    const result = await postsModel.create({content, image, user});
    handleSuccess(res, result);
  },
  async editPost(req, res, next) {
    const { content, image } = req.body;
    const editPost = {};
    if(!content?.trim() && !image?.trim()) {
      return next(new appError('貼文內容或圖片請擇一更新'));
    }
    if(image) {
      editPost.image = image;
    }
    if(content) {
      editPost.content = content;
    }
    const result = await postsModel.findByIdAndUpdate(req.params.postId ,editPost, {
      runValidators: true,
      new: true,
    })
    handleSuccess(res, result);
  },
  async deletePost(req, res, next) {
    await postsModel.findByIdAndDelete(req.params.postId);
    const posts = await postsModel.find().select('-user -updatedAt');
    handleSuccess(res, posts);
  },
  async likePost(req, res, next) {
    const result = await postsModel.findByIdAndUpdate(
      req.params.postId, 
      { $addToSet: { likes: req.body.userId }},
      { new: true }
    );
    handleSuccess(res, result);
  },
  async unlikePost(req, res, next) {
    const result = await postsModel.findByIdAndUpdate(
      req.params.postId, 
      { $pull: { likes: req.body.userId }},
      { new: true }
    );
    console.log(result);
    handleSuccess(res, result);
  }
}

module.exports = postsController;