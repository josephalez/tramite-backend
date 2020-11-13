//const bcrypt = require('bcrypt');
const db = require('../../database/db');
//const jwt = require('jwt-simple');

const administrado_findall = async (req, res) => {
    console.log("[/api/administrado_findall]");
    console.log("req.query : " + JSON.stringify(req.query));
    let filter = decodeURI(req.query.filter);
    var filter_parseado = filter?JSON.parse(filter):{};//JSON.parse(JSON.stringify(JSON.parse(filter), null, 2));
    let pageNumber = req.query.pageNumber || 1; // ejemplo 1
    let pageSize = req.query.pageSize || 10; // ejemplo 10
    let offset = (pageNumber - 1) * pageSize; // limites
    let sortOrder = req.query.sortOrder; // ejemplo asc||desc
    let sortField = req.query.sortField; // ejemplo ADMI_VC_NOMCOMPLETO
 
    /* -- Obtenemos los valores de los filtros */
    let filter_nombres = filter_parseado.nombres || null; // busqueda por palabra    
    let filter_type = filter_parseado.type || null;  // el id del combo tipo doc: el valor de CPM_VC_TIPO

    console.log("req.parametro : " + filter_parseado);
  
    let query = "SELECT A.* FROM V_CRUD_ADMINISTRADO A "; // query que va ir armandose
    let query_count = "SELECT COUNT(*) AS TOTAL FROM V_CRUD_ADMINISTRADO A"; // total de registros de la tabla
    let query_limit = "  LIMIT " + offset + "," + pageSize;  // traer solo data en este rango
    let where = "" ;
    if(filter_nombres) where+=" WHERE (A.ADMI_VC_NRODOCUMENTO LIKE '%" + filter_nombres + "%' OR A.ADMI_VC_NOMCOMPLETO LIKE '%" + filter_nombres + "%' OR A.ADMI_VC_TELEFONO LIKE '%" + filter_nombres + "%' OR A.ADMI_VC_DIRECOMPLETA LIKE '%" + filter_nombres + "%') ";
    let ordenar = "";
    if (sortField != undefined) {
        ordenar = ordenar + " ORDER BY A." + sortField + " " + sortOrder;
    }
    if (filter_type != undefined) { 
        where = (where?where+" AND":" WHERE")  + " A.CPM_VC_TIPO = " + db.escape(filter_type);
    }

    console.log("query count : " + query_count + where);
    db.query(query_count + where, function (error, results, fields) {
        console.log(results)
        if (error)
            return res.status(400).json(error);
        let row_count = results[0].TOTAL;
        //console.log("results[0] == " + row_count);
        if (row_count == 0) { 
            //res.json({ error: false, items: [], totalCount: row_count });
            return res.status(200).json({ error: false, entities: [], totalCount: row_count });
        } else {
            console.log("query : " + query + where + ordenar + query_limit);
            db.query(query + where + ordenar + query_limit, function (err, results, fields) {
                if (err) return res.status(400).json(err);
                //res.json({ error: false, items: results, totalCount: row_count });        
                console.log('rows count', row_count);       
                return res.status(200).json({ error: false, entities: results, totalCount: row_count });
            });
        }

    });
}

const administrado_insert = async (req, res) => {
    console.log("/api/administrado_insert");
    let { CPM_VC_TIPO, ADMI_VC_NOMBRES, ADMI_VC_PATERNO,
        ADMI_VC_MATERNO, ADMI_VC_NRODOCUMENTO, ADMI_VC_DIRECOMPLETA, 
        ADMI_VC_TELEFONO, ADMI_VC_CORREO, AUDI_VC_TERMINAL
    } = req.body;

    let AUDI_IN_USER = req.user.USER_IN_CODIGO;
    let AUDI_VC_USER = req.user.USER_VC_NOMBRE;

    console.log('tipo', CPM_VC_TIPO, AUDI_VC_USER, AUDI_IN_USER, AUDI_VC_TERMINAL);

    let { OUT_MENSAJE, OUT_CODIGO, OUT_VALOR } = "";
    const sql = `CALL SP_CRUD_ADMINISTRADO(?,?,?,?,?,?,?,?,?,?,?,?,?,?,@OUT_MENSAJE,@OUT_CODIGO,@OUT_VALOR); SELECT @OUT_MENSAJE,@OUT_CODIGO,@OUT_VALOR;`;
    db.query(sql, [-1, CPM_VC_TIPO, '', ADMI_VC_NOMBRES, ADMI_VC_PATERNO,
        ADMI_VC_MATERNO, ADMI_VC_NRODOCUMENTO, ADMI_VC_DIRECOMPLETA, ADMI_VC_TELEFONO, ADMI_VC_CORREO
        , '', AUDI_IN_USER, AUDI_VC_USER, AUDI_VC_TERMINAL], function (err, rows) {
            if (err) {

                console.log("error", err)
                return res.status(400).json(err);
            }
            console.log(rows);
            let parametros_out = JSON.stringify(rows[1][0]);
            console.log(parametros_out);
            OUT_MENSAJE = JSON.parse(parametros_out)['@OUT_MENSAJE'];
            OUT_CODIGO = JSON.parse(parametros_out)['@OUT_CODIGO'];
            OUT_VALOR = JSON.parse(parametros_out)['@OUT_VALOR'];
            if (OUT_CODIGO == 200) {
                return res.status(201).json({ message: OUT_MENSAJE });
            } else {
                return res.status(400).json({ message: OUT_MENSAJE });
            }
        });
} 

const administrado_update = async (req, res) => {
    console.log("/api/administrado_update/:id");
    let { CPM_VC_TIPO, ADMI_VC_NOMBRES, ADMI_VC_PATERNO,
        ADMI_VC_MATERNO, ADMI_VC_NRODOCUMENTO, ADMI_VC_DIRECOMPLETA, 
        ADMI_VC_TELEFONO, ADMI_VC_CORREO, AUDI_VC_TERMINAL
    } = req.body;

    let AUDI_IN_USER = req.user.USER_IN_CODIGO;
    let AUDI_VC_USER = req.user.USER_VC_NOMBRE;

    let { id } = req.params;
    let ADMI_IN_CODIGO = id;
    let { OUT_MENSAJE, OUT_CODIGO, OUT_VALOR } = "";
    console.log("ADMI_IN_CODIGO : " + ADMI_IN_CODIGO);
    const sql = `CALL SP_CRUD_ADMINISTRADO(?,?,?,?,?,?,?,?,?,?,?,?,?,?,@OUT_MENSAJE,@OUT_CODIGO,@OUT_VALOR); SELECT @OUT_MENSAJE,@OUT_CODIGO,@OUT_VALOR;`;
    db.query(sql, [ADMI_IN_CODIGO, CPM_VC_TIPO, '', ADMI_VC_NOMBRES, ADMI_VC_PATERNO,
        ADMI_VC_MATERNO, ADMI_VC_NRODOCUMENTO, ADMI_VC_DIRECOMPLETA, ADMI_VC_TELEFONO, ADMI_VC_CORREO
        , '', AUDI_IN_USER, AUDI_VC_USER, AUDI_VC_TERMINAL], function (err, rows) {
            if (err) { 
                console.log("error", err)
                return res.status(400).json(err);
            }
            let parametros_out = JSON.stringify(rows[1][0]);
            console.log(parametros_out);
            OUT_MENSAJE = JSON.parse(parametros_out)['@OUT_MENSAJE'];
            OUT_CODIGO = JSON.parse(parametros_out)['@OUT_CODIGO'];
            OUT_VALOR = JSON.parse(parametros_out)['@OUT_VALOR'];
            if (OUT_CODIGO == 200) {
                return res.status(201).json({ message: OUT_MENSAJE });
            } else {
                return res.status(400).json({ message: OUT_MENSAJE });
            }
        });
}


module.exports = {
    administrado_findall,      // buscar administrado en la lista del crud
    //api_get_adminitrado,      // buscar un administrado especificamente
    administrado_insert,    // insertar administrado
    administrado_update     // actualiza administrado
}