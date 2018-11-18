var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
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
MovieSchema.pre('save', function(next){
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now()
    }
    next();
})

//静态方法
MovieSchema.statics = {
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

module.exports = MovieSchema