var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

// 将 cookie 信息保存到 mongodb 中
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var setting = require('./setting');
// var FileStore = require('session-file-store')(session);


var bodyParser = require('body-parser');
var consolidate = require('consolidate');
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');


var app = express();


// 允许跨越请求
// app.all('*', function(req, res, next) {
// res.header("Access-Control-Allow-Origin", "*");
// res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
// res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
// res.header("X-Powered-By",' 3.2.1');
// if(req.method=="OPTIONS") res.sendStatus(200);
// else  next();
// });


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.engine("ejs", consolidate.ejs);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');   // 扩展名的省略


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// session store
app.use(session({
    secret: "123",
    key: 'sid',
    store: new MongoStore({
        url: 'mongodb://localhost/session',
    }),
    resave: true,
    saveUninitialized: true,
}));


/*app.use(session({
 // store: new FileStore(),  // 将session存储到一个文件中，比如浏览器关闭后session无效的问题
 // cookie: {maxAge: 2000 * 1000},  // 过期时间20秒
 // secret: "dingxing"


 }));*/


/*app.use(session({
 secret: 'myblog',
 key: "cookie11111",//cookie name
 cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
 resave: false,
 saveUninitialized: true,
 store: new MongoStore({
 // url: db_config.module.dbUrl //这里就是coding连接信息的uri
 url: 'mongodb://localhost/session'
 })

 }));*/


/*var sessionStore = new MongoStore({
 host: '127.0.0.1',
 port: '27017',
 db: 'session',
 url: 'mongodb://localhost:27017/demo'
 });

 //session store:
 app.use(express.session({
 secret: 'my secret sign key',
 store: sessionStore
 }));*/


app.use('/', index);
app.use('/users', users);
app.use('/api', api);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
