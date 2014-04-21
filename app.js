
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var partials = require('express-partials');

var sessionController = require('./routes/session_controller.js');
var postController = require('./routes/post_controller');
var userController = require('./routes/user_controller.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('--Core Blog 2014--'));
app.use(express.session());

app.use(partials());

app.use(require('express-flash')());


// Helper dinamico:
app.use(function(req, res, next) {

   // Hacer visible req.session en las vistas
   res.locals.session = req.session;

   next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// Helper estatico:
app.locals.escapeText =  function(text) {
   return String(text)
          .replace(/&(?!\w+;)/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/\n/g, '<br>');
};

//-- Rutas -----------------

app.get('/', routes.index);

//-- Session ---------------

app.get('/login',  sessionController.new);
app.post('/login', sessionController.create);
app.get('/logout', sessionController.destroy);

//-- Auto Load -------------

app.param('postid',postController.load);
app.param('userid', userController.load);

//-- Posts -----------------

app.get(   '/posts',                 postController.index);
app.get(   '/posts/new',             sessionController.loginRequired,
                                     postController.new);
app.get(   '/posts/:postid([0-9]+)', postController.show);
app.post(  '/posts',                 sessionController.loginRequired,
                                     postController.create);

app.get(   '/posts/:postid([0-9]+)/edit', sessionController.loginRequired,
                                          postController.loggedUserIsAuthor,
                                          postController.edit);

app.put(   '/posts/:postid([0-9]+)', sessionController.loginRequired,
                                     postController.loggedUserIsAuthor,
                                     postController.update);

app.delete('/posts/:postid([0-9]+)', sessionController.loginRequired,
                                     postController.loggedUserIsAuthor,
                                     postController.destroy);

//-- Users -----------------

app.get(   '/users',                 userController.index);

app.get(   '/users/new',             userController.new);

app.get(   '/users/:userid([0-9]+)', userController.show);

app.post(  '/users',                 userController.create);

app.get(   '/users/:userid([0-9]+)/edit', sessionController.loginRequired,
                                     userController.loggedUserIsUser,
                                     userController.edit);

app.put(   '/users/:userid([0-9]+)', sessionController.loginRequired,
                                     userController.loggedUserIsUser,
                                     userController.update);

// app.delete('/users/:userid([0-9]+)', sessionController.loginRequired,
//                                     userController.destroy);

//--------------------------


// Fichero o ruta no existente:
app.use(function(req,res,next) {
    next(new Error('Recurso \"'+req.url+'\" no encontrado'));
});

// Gestion de errores

if ('development' == app.get('env')) {
  // development
  app.use(function(err,req,res,next) {
    res.render('error', { message: err.message,
                          stack:   err.stack 
              });
  });
} else { 
  // produccion
  app.use(function(err,req,res,next) {
    res.render('error', { message: err.message,
                          stack:   null 
              });
  });
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
