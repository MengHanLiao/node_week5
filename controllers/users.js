const userModel = require('../models/users');
const appError = require('../services/appError');
const handleSuccess = require('../services/handleSuccess');

const userController = {
  async getAllUser(req, res, next) {
    /*
      #swagger.tags = ['Users']
      #swagger.description = '取得全部使用者 id、暱稱'
      #swagger.responses[200] = {
        description: '成功',
        schema: { $ref: '#/definitions/getUsers' }
      }
    */
    const result = await userModel.find().select('id nickname');
    handleSuccess(res, result);
  },
  async registerUser(req, res, next) {
    /*
      #swagger.tags = ['Users']
      #swagger.description = '新增使用者'
    */
    const { email, password, photo } = req.body;
    let nickname = req.body.nickname || '新用戶';
    const result = await userModel.create({ email, password, photo, nickname });
    handleSuccess(res, {
      id: result.id,
      nickname: result.nickname
    });
  },
  validateUser(req, res, next) {
    const { email, password, photo } = req.body;
    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const trimEmail = email?.trim();
    if (!regexp.test(trimEmail)) {
      next(new appError('Email 格式不正確或為空值，請重新輸入'));
    } else if (!password?.trim()) {
      next(new appError('密碼為必填'))
    } else if (!photo?.trim()) {
      next(new appError('請選擇使用者圖片'))
    }
    next();
  },
};

module.exports = userController;