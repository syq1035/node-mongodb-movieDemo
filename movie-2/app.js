var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var port = process.env.PORT || 3000;
var app = express();

var dbUrl = 'mongodb://localhost/movieWeb'
//数据库连接
mongoose.connect(dbUrl, { useNewUrlParser: true }, err=>{
    if(err) 
        console.log("数据库连接失败，可能是服务未开启！");
    else 
        console.log("数据库连接成功！");
});

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));   //extended:true 重点
app.use(cookieParser());
app.use(session({
    secret: "movie",
    resave: false,
    saveUninitialized: true,   // 选择false也有助于客户在没有会话的情况下发出多个并行请求的竞争条件。
    store: new MongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}))
app.use(express.static(path.join(__dirname,'node_modules')))  //静态文件的路径
app.use(express.static(path.join(__dirname,'public')))  //静态文件的路径
app.locals.moment = require('moment');  //引入moment格式化时间

if('development' == app.get('env')){
    app.set('showStackError',true);
    app.use(logger(':method :url :status'));  //打印日志
    app.locals.pretty = true;  //格式化源代码
    mongoose.set('debug', true);
}


require('./config/routes')(app);
app.listen(port);

console.log('Start on port '+port);

