
const mysql= require('mysql');

const connection = mysql.createPool({
    /*
    host:'localhost',
    user:'root',
    database:'tramite_api',
    password:'',
    // servidor central tramite documentario
    */
    host:'vps-1730597-x.dattaweb.com',
    user:'tramite',
    database:'tramiteweb',
    password:'Tramite$$',
    multipleStatements: true, // COCHOA: AGREGADO PARA SOPORTAR SP OUT PARAMETROS

    // RFIGUERA: AGREGADO PARA SOPORTAR TIEMPO DEL SP
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,  
});

connection.on('error', (err)=>{
    console.log('\n\n\nMySql error: '+err+'\n\n\n\n');
}) 

module.exports = connection;

