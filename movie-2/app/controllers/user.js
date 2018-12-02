var User = require('../models/user');

// signup
exports.showSignup = function(req, res){
    res.render('signup',{
        title: '注册页面',
    })
}

// signin
exports.showSignin = function(req, res){
    res.render('signin',{
        title: '登录页面',
    })
}

// 注册
exports.signup = function(req, res){
    var _user = req.body.user;

    //判断该name值是否已占用
    User.findOne({name: _user.name}, function(err, user){
        if(err){
            console.log(err);
        }
        if(user){
            console.log("该用户名已被占用");
            res.redirect('/signin');
        }else{
            var user = new User(_user);
            user.save(function(err, user){
                if(err){
                    console.log(err);
                }
                //- console.log(_user);
                res.redirect('/');
            })        
        }
    })
}

// 登录
exports.signin = function(req, res){
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name: name}, function(err, user){
        if(err){
            console.log(err);
        }

        if(!user){
            console.log("用户不存在");
            return res.redirect('/signup')
        }

        user.comparePassword(password, function(err, isMatch){
            if(err){
                console.log(err);
            }
            if(isMatch){
                req.session.user = user;
                console.log("Password is matched");
                return res.redirect('/');
            }else{
                console.log("Password is not matched");
                return res.redirect('/signin');
            }
        })
    })
}

// 退出
exports.logout = function(req, res){
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/');
}


// userlist page
exports.list = function(req, res){
    User.fetch(function(err, users){
        if(err){
            console.log(err);
        }
        res.render('userList',{
            title: '用户列表页',
            users: users
        })
    })
}

//midware for user
exports.signinRequired = function(req, res, next){
    var user = req.session.user;

    if(!user){
        return res.redirect('/signin');
    }

    next();
}

//midware for user
exports.adminRequired = function(req, res, next){
    var user = req.session.user;

    if(user.role <= 10){
        return res.redirect('/signin');
    }

    next();
}
