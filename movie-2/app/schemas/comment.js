var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = Schema({
    movie: {type: ObjectId, ref: 'Movie'}, //关联
    from: {type: ObjectId, ref: 'User'},
    reply: [{    //子评论
        from: {type: ObjectId, ref: 'User'},
        to: {type: ObjectId, ref: 'User'},
        content: String
    }],
    content: String,
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
CommentSchema.pre('save', function(next){
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now()
    }
    next();
})

//静态方法
CommentSchema.statics = {
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

module.exports = CommentSchema