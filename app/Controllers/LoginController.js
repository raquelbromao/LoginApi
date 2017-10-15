'use strict';

var Usuario = require('../Models/LoginModel');
var jwt = require('jwt-simple');
var moment = require('moment');
var segredo = 'krishn50';

exports.criarUsuario = function(req, res) {
      //  Cria struct de dados a partir dos campos de requisições do HTML
      var data = new Usuario({
        username: req.body.username,
        password: req.body.password
      });

        //  Salva esse novo usuário no BD
        data.save(function(err) {
          if (err)
            res.send(err);
          res.json({ message: 'Novo Usuário', data: data });
        });
};

exports.criarLogin = function(req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';

  //  Se os campos de username e senha estiverem nulos um erro é retornado
  if (username == '' || password == '') {
    return res.send(401);
  }

  /*Buscamos por usuários com os dados informados.
    Se der erro, res.end(401).
    Se não der erro, continua, retornando o resultado como user.
  */
  Usuario.findOne({username: username}, function (err, usuario) {
    if (err) {
      return res.end(401)
    }

    /* Lembra do método que foi criado em LoginModel -> LoginSchema.methods.verificaSenha
      Se ele não retornar o parâmetro isMatch é retornado res.end(401).
    */
    usuario.verificaSenha(password, function(isMatch) {
      if (!isMatch) {
        return res.send(401);
      }

      //  Módulo moment é usado para dizer que ‘daqui a 7 dias’ esse token será expirado.
      //  var token, onde criamos o token com jwt.encode().
      var expires = moment().add(7,'days').valueOf();
      var token = jwt.encode({
        iss: usuario.id,
        exp: expires
      }, segredo);

      //4
      return res.json({
        token : token,
        expires: expires,
        usuario: usuario.toJSON()
      });
    });
  });
};

exports.validarJWT = function (req, res) {
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

  //1
  if (token) {
    try {
      var decoded = jwt.decode(token, segredo);
      console.log('Decodando o token ' + decoded);

      //2
      if (decoded.exp <= Date.now()) {
        res.json(400, {error: 'Acesso Expirado, faça login novamente'});
      } else {
        //3
        Usuario.findOne({ _id: decoded.iss }, function(err, usuario) {
          if (err) {
            res.status(500).json({message: "Erro ao procurar usuario do token."})
          } else {
            req.user = usuario;
            console.log('Usuário encontrado: ' + req.user);
            return res.json({message: "Sucesso!"});
          }
        });
      }

    //4
    } catch (err) {
      return res.status(401).json({message: 'Erro: Seu token é inválido'});
    }
  } else {
    res.json(401, {message: 'Token não encontrado ou informado'})
  }
};
