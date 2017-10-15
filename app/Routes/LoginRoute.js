'use strict';

module.exports = function(app) {
  var metodos = require('../controllers/LoginController');

  app.route('/usuarios')
      .get(metodos.validarJWT, function(req, res){
        res.json({message: "token sucesso"})
      })
      .post(metodos.criarUsuario);

  app.route('/login')
      .post(metodos.criarLogin);
};
