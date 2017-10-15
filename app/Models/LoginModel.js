'use strict'

var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoginSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  }
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

//  Verifica senha
LoginSchema.methods.verificaSenha = function(password, next) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return next(err);
    //  se isMatch = TRUE -> SUCESSO || = FALSE -> ERRO
    next(isMatch);
  });
};

module.exports = mongoose.model('Usuarios', LoginSchema);
