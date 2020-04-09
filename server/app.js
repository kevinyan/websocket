var express = require('express');
var createError = require('http-errors');
var fs = require('fs');
// cookie中间件
var cookieParser = require('cookie-parser');
// 日志中间件
var logger = require('morgan');
var http = require('http');
var path = require('path');

var indexRouter = require('./routes/index');
var socketRouter = require('./routes/socket');

var app = express();

// 路由规则: app.use(path,router) router代表一个由express.Router()创建的对象
// 日志
// 打印到控制台
app.use(logger('dev'));
// 打印到日志文件
// var accessLog = fs.createWriteStream('./logs/access.log', {flags : 'a'});
// app.use(logger('combined', {stream : accessLog}));
// 传入参数json形式分析
app.use(express.json());
//
app.use(express.urlencoded({ extended: false }));
// 使用cookie中间件
app.use(cookieParser());
// 提供对静态资源文件（图片，css，js文件）的服务, eg: host + port + '/js/1111.js'
app.use(express.static(path.join(__dirname, 'public')));

// 首页处理
app.use('/', indexRouter);

// 捕获404并转发到错误处理程序
app.use(function(req, res, next) {
  next(createError(404));
});

// 错误处理程序
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
// 端口设置
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
// 创建http请求
var server = http.createServer(app);
server.listen(port);
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
server.on('error', onError);
server.on('listening', onListening);

// socket
socketRouter.init();
