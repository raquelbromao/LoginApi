'use strict'

var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoginSchema = new Schema({
    name: String,
    password: String
});

//  Realiza o salto e criptografa a senha antes de salvar no BD
LoginSchema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);

            //  Verifica se a criptografia criada e senha realmente são iguais
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', LoginSchema);
