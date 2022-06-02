var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const options = {
  swaggerOptions: {
    defaultModelsExpandDepth: -1
  }
};

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

var app = express();

require('./connection');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api', postsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, options));
app.use((req, res, next) => {
  res.status(404).send({
    status: "error",
    message: "找不到該路由"
  });
});

// production 與 develop 不同的錯誤回饋
const resProductionErr = (err, res) => {
  let message = err.message;
  if(!err.isOperational) {
    console.error('出現重大錯誤', err);
    err.statusCode = 500;
    message = '系統錯誤，請恰系統管理員';
  }
  res.status(err.statusCode).send({
    status: 'error',
    message
  });
};
const resDevelopeErr = (err, res) => {
  res.status(err.statusCode).send({
    status: "error",
    message: err.message,
    error: err,
    stack: err.stack
  });
};

// error middleware
app.use(function(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  if (err.name === 'ValidationError'){
    err.statusCode = 400;
    err.message = "資料欄位未填寫正確，請重新輸入！"
    err.isOperational = true;
  }
  process.env.NODE_ENV === 'dev' ? resDevelopeErr(err, res) : resProductionErr(err, res);
})

// 沒有被定義、意料之外的錯誤
process.on('uncaughtException', err => {
  // 記錄錯誤，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！')
  console.error(err);
  process.exit(1);
});
// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
