var mysql = require('mysql');
var migration = require('mysql-migrations');

var connection = mysql.createPool({
  connectionLimit : 1000,
  connectTimeout  : 60 * 60 * 1000,
  acquireTimeout  : 60 * 60 * 1000,
  timeout         : 60 * 60 * 1000,
  
  /*
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'tramite_api',
  
  */
  host:'vps-1730597-x.dattaweb.com',
  user:'tramite',
  database:'tramiteweb',
  password:'Tramite$$',
});

/*
 * 
 *   para ejecutar las migraciones ejecutrar el comando
 * 
 *   npm run migrate up
 *    
 *  para crear migraciones
 * 
 *   npm run migrate add migration nombre de la migración
 * 
 */

migration.init(connection, __dirname + '/migrations');