const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const handleErrorAsync = require('../services/handleErrorAsync');

router.get('/posts', postsController.getAllPosts);
router.post('/post',handleErrorAsync(postsController.isUserExist), handleErrorAsync(postsController.addPost)); 
router.use('/post/:postId', handleErrorAsync(postsController.isPostExist));
router.patch('/post/:postId', handleErrorAsync(postsController.editPost));
router.delete('/post/:postId', handleErrorAsync(postsController.deletePost));
router.post('/post/:postId/like', handleErrorAsync(postsController.isUserExist), handleErrorAsync(postsController.likePost));
router.delete('/post/:postId/like', handleErrorAsync(postsController.isUserExist), handleErrorAsync(postsController.unlikePost));

module.exports = router;