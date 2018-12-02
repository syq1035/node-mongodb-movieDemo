var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WOEK_FACTOR =10;

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    // 0: nomal user
    // >10: admin
    // >50: super admin
    role: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})
//每次存储前都要调用一下这个方法
UserSchema.pre('save', function(next){
    var user = this;
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now()
    }
    //密码加盐加密存储
    bcrypt.genSalt(SALT_WOEK_FACTOR,function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err) return next(err);

            user.password = hash;
            next();
        })
    })

    next();
})

UserSchema.methods = {
    comparePassword: function(_password, cb){
        bcrypt.compare(_password, this.password, function(err, isMatch){
            if(err) return cb(err)
            
            cb(null, isMatch);
        })
    }
}

//静态方法
UserSchema.statics = {
    // 用来取出目前数据库中所有数据
    fetch: function(cb){
        return this
          .find({})
          .sort('meta.updateAt')
          .exec(cb)
    },
    // 用来查询单条数据
    finfById: function(id, cb){
        return this
          .findOne({'_id': id})
          .exec(cb)  //即执行完后将调用callback函数
    }
}

module.exports = UserSchema