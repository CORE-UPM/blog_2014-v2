
var path = require('path');

var Sequelize = require('sequelize');

// Configurar Sequelize para usar SQLite.
// No hay Bases de datos, ni usuarios, ni passwords.
// El fichero con la BBDD es blog.sqlite.

var sequelize = new Sequelize(null,null,null,
                              {dialect:"sqlite",
                               storage:"blog.sqlite",
                               define: {
                                 underscored: false
                               }
                              });


// Importar la definicion de las clases.
// La clase Post se importa desde el fichero post.js.
var Post = sequelize.import(path.join(__dirname,'post'));

// Exportar los modelos:
exports.Post = Post;


// Crear las tablas en la base de datos que no se hayan creado aun.
// En un futuro lo haremos con migraciones.
sequelize.sync();
