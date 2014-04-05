
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var partials = require('express-partials');

var postController = require('./routes/post_controller');

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
app.use(express.cookieParser('your secret here'));
app.use(express.session());

app.use(partials());

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

// Rutas

app.get('/', routes.index);

app.param('postid',postController.load);  // autoload :postid

app.get('/posts', postController.index);
app.get('/posts/new', postController.new);
app.get('/posts/:postid([0-9]+)', postController.show);
app.post('/posts', postController.create);
app.get('/posts/:postid([0-9]+)/edit', postController.edit);
app.put('/posts/:postid([0-9]+)', postController.update);
app.delete('/posts/:postid([0-9]+)', postController.destroy);


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
