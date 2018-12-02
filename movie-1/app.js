var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie')
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();

//数据库连接
mongoose.connect('mongodb://localhost/movieWeb', { useNewUrlParser: true }, err=>{
    if(err) 
        console.log("数据库连接失败，可能是服务未开启！");
    else 
        console.log("数据库连接成功！");
});

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));   //extended:true 重点
app.use(express.static(path.join(__dirname,'node_modules')))  //静态文件的路径
app.use(express.static(path.join(__dirname,'public')))  //静态文件的路径
app.locals.moment = require('moment');  //引入moment格式化时间

app.listen(port);

console.log('Start on port '+port);

app.get('/',function(req, res){
    Movie.fetch(function(err, movies){
        if(err){
            console.log(err);
        }
        res.render('index',{
            title: '首页',
            movies: movies
        })
    })

    // res.render('index',{
    //     title: '首页',
    //     movies:[{ 
    //         title:"机械战警",
    //         _id:1,
    //         poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
    //     },{
    //         title:"X战警",
    //         _id:2,
    //         poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
    //     },{
    //         title:"皇家骑士",
    //         _id:3,
    //         poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
    //     },{ 
    //         title:"机械战警",
    //         _id:1,
    //         poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
    //     },{
    //         title:"X战警",
    //         _id:2,
    //         poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
    //     },{
    //         title:"皇家骑士",
    //         _id:3,
    //         poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
    //     }]
    // })
})
app.get('/movie/:id',function(req, res){
    var id = req.params.id;

    Movie.findById(id, function(err,movie){
        if(err){
            console.log(err);
        }
        res.render('detail', {
            title: '详情页',
            movie: movie
        })
    })
    // res.render('detail',{
    //     title: '详情页',
    //     movie: {
    //         doctor:'何塞.帕迪利亚',
    //         country:"美国",
    //         title:"机械战警",
    //         year:2014,
    //         poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5",
    //         language:"英语",
    //         flash:"http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf",
    //         summary:"《机械战警》是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。影片的故事背景与原版基本相同，故事设定在2028年的底特律，男主角亚历克斯·墨菲是一名正直的警察，被坏人安装在车上的炸弹炸成重伤，为了救他，OmniCorp公司将他改造成了生化机器人“机器战警”，代表着美国司法的未来。"
    //     }
    // })
})

app.get('/admin/movie',function(req, res){
    res.render('admin',{
        title: '后台录入页',
        movie:{
            title:"",
            doctor:"",
            country:"",
            year:"",
            poster:"",
            flash:"",
            summary:"",
            language:""
         }
    })
})

//admin update movie
app.get('/admin/update/:id', function(req,res){
    var id = req.params.id;

    if(id){
        Movie.findById(id, function(err,movie){
            res.render('admin',{
                title: '后台更新',
                movie: movie
            })
        })
    }
})

//admin post movie
app.post('/admin/movie/new', function(req, res){
    console.log(req.body.movie)
    //var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie

    if(req.body.movie._id == 'undefined'){
        _movie = new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country, 
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster, 
            summary:movieObj.summary,
            flash:movieObj.flash   
        })
        _movie.save(function(err, movie){
            if(err){
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        })
    }else{
        Movie.findById(req.body.movie._id, function(err, movie){
            if(err){
                console.log(err);
            }
            _movie = _.extend(movie, movieObj)  // _.extend用新对象里的字段替换老的字段
            _movie.save(function(err, movie){
                if(err){
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            })
        })       
    }
})

app.get('/admin/list',function(req, res){
    Movie.fetch(function(err, movies){
        if(err){
            console.log(err);
        }
        res.render('list',{
            title: '列表页',
            movies: movies
        })
    })

    // res.render('list',{
    //     title: '列表页',
    //     movies:[{
    //         title:"机械战警",
    //         _id:1,
    //         doctor:'何塞.帕迪利亚',
    //         country:"美国",
    //         year:2014,
    //         poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5",
    //         language:"英语",
    //         flash:"http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf",
    //         summary:"《机械战警》是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。影片的故事背景与原版基本相同，故事设定在2028年的底特律，男主角亚历克斯·墨菲是一名正直的警察，被坏人安装在车上的炸弹炸成重伤，为了救他，OmniCorp公司将他改造成了生化机器人“机器战警”，代表着美国司法的未来。"

    //     }]
    //})
})

//list delete movie
app.delete('/admin/list',function(req, res){
    var id = req.query.id;

    if(id){
        Movie.remove({_id: id}, function(err, movie){
            if(err){
                console.log(err)
            }
            else{
                res.json({success: 1});
            }
        })
    }
})