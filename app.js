'user strict'
// requires
const express = require('express');
const bodyParser = require('body-parser');
const cors= require('cors');

// Ejecutar Express
let app = express();
// Cargar archivos de rutas
// Middlewares
app.use(bodyParser.urlencoded({extended:false})) // para que body parse funcione
app.use(bodyParser.json()); // el body la peticion lo convierte a json

app.use(cors());// CORS


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
    next();
  });

const router = require('./routes/router')

app.use('/api', router);
//app.use( require('./rutas/slide.ruta'));

// reescribir rutas
// exportar modulo

module.exports = app;