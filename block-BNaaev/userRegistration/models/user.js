var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const { NotExtended } = require('http-errors');

var Schema = mongoose.Schema;


var userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 5 },
    age: Number,
    phone: Number,
});

userSchema.pre('save', function(next) {
    if(this.password && this.isModified('password')) {
        bcrypt.hash(this.password, 10, (err, hashed) => {
            if (err) return next(err);
            this.password = hashed;
            return next();
        });
    } else {
        next();
    }
});


var User = mongoose.model('User', userSchema);


module.exports = User;