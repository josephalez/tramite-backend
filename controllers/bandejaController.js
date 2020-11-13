const db = require('../database/db');
const jwt = require('jwt-simple');

const rol_findall = async (req, res) => {
    console.log("[/api/rol_findall]");
    console.log("req.query : " + JSON.stringify(req.query));
    let filter = decodeURI(req.query.filter);   
    var filter_parseado = JSON.parse(JSON.stringify(JSON.parse(filter), null, 2));
    let pageNumber = req.query.pageNumber; // ejemplo 1
    let pageSize = req.query.pageSize; // ejemplo 10
    let offset = (pageNumber - 0) * pageSize; // limites
    let sortOrder = req.query.sortOrder; // ejemplo asc||desc
    let sortField = req.query.sortField; // ejemplo ORGA_VC_NOMBRE

    /* -- Obtenemos los valores de los filtros */
    let filter_nombres = filter_parseado.nombres; // busqueda por palabra    
    let filter_type = filter_parseado.type;  // el id del combo tipo doc: el valor de CPM_VC_TIPO

    let query = "SELECT A.* FROM V_CRUD_ORG A "; // query que va ir armandose
    let query_count = "SELECT COUNT(*) AS TOTAL FROM V_CRUD_ORG"; // total de registros de la tabla
    let query_limit = "  LIMIT " + offset + "," + pageSize;  // traer solo data en este rango
    let where = " WHERE (A.ORGA_VC_SIGLA LIKE '%" + filter_nombres + "%' OR A.ORGA_VC_NOMBRE LIKE '%" + filter_nombres + "%' OR A.ORGA_VC_DIRECCION LIKE '%" + filter_nombres + "%') ";
    let ordenar = "";
    if (sortField != undefined) {
        ordenar = ordenar + " ORDER BY A." + sortField + " " + sortOrder;
    }
    if (filter_type != undefined) {
        if (filter_type != -1) {
            where = where + " and A.ORGA_FG_ESTADO = " + filter_type;
        }        
    }
    console.log("query count : " + query_count + where);
    dbConn.query(query_count + where, function (error, results, fields) {
        if (error)
            return res.status(400).json(err);
        let row_count = results[0].total;        
        if (row_count == 0) {            
            return res.status(200).json({ error: false, entities: [], totalCount: row_count });
        } else {
            console.log("query : " + query + where + ordenar + query_limit);
            dbConn.query(query + where + ordenar + query_limit, function (error, results, fields) {
                if (error) return res.status(400).json(err);                
                return res.status(200).json({ error: false, entities: results, totalCount: row_count });
            });
        }

    });
}

const bandeja_findall = async (req, res) => {
    console.log("[/api/bandeja_findall]");
    console.log("req.query : " + JSON.stringify(req.query));
    let filter = decodeURI(req.query.filter);   
    var filter_parseado = JSON.parse(JSON.stringify(JSON.parse(filter), null, 2));
    let pageNumber = req.query.pageNumber; // ejemplo 1
    let pageSize = req.query.pageSize; // ejemplo 10
    let offset = (pageNumber - 0) * pageSize; // limites
    let sortOrder = req.query.sortOrder; // ejemplo asc||desc
    let sortField = req.query.sortField; // ejemplo BAND_VC_NOMBRE

    /* -- Obtenemos los valores de los filtros */
    let filter_nombres = filter_parseado.nombres; // busqueda por palabra    
    let filter_type = filter_parseado.type;  // el id del combo tipo doc: el valor de CPM_VC_TIPO

    let query = "SELECT A.* FROM V_CRUD_BANDEJA A "; // query que va ir armandose
    let query_count = "SELECT COUNT(*) AS TOTAL FROM V_CRUD_BANDEJA"; // total de registros de la tabla
    let query_limit = "  LIMIT " + offset + "," + pageSize;  // traer solo data en este rango
    let where = " WHERE (A.ORGA_VC_SIGLA LIKE '%" + filter_nombres + "%' OR A.ORGA_VC_NOMBRE LIKE '%" + filter_nombres + "%' OR A.ORGA_VC_DIRECCION LIKE '%" + filter_nombres + "%') ";
    let ordenar = "";
    if (sortField != undefined) {
        ordenar = ordenar + " ORDER BY A." + sortField + " " + sortOrder;
    }
    if (filter_type != undefined) {
        if (filter_type != -1) {
            where = where + " and A.ORGA_FG_ESTADO = " + filter_type;
        }        
    }
    console.log("query count : " + query_count + where);
    dbConn.query(query_count + where, function (error, results, fields) {
        if (error)
            return res.status(400).json(err);
        let row_count = results[0].total;        
        if (row_count == 0) {            
            return res.status(200).json({ error: false, entities: [], totalCount: row_count });
        } else {
            console.log("query : " + query + where + ordenar + query_limit);
            dbConn.query(query + where + ordenar + query_limit, function (error, results, fields) {
                if (error) return res.status(400).json(err);                
                return res.status(200).json({ error: false, entities: results, totalCount: row_count });
            });
        }

    });
}

const org_insert = async (req, res) => {
    console.log("/api/org_insert");
    let { ORGA_IN_CODIGO, ORGA_VC_NUMERO, ORGA_VC_SIGLA, ORGA_VC_NOMBRE, ORGA_VC_DIRECCION,
        ORGA_FG_ESTADO, AUDI_IN_USER, AUDI_VC_USER, AUDI_VC_TERMINAL } = req.body;
    let { OUT_MENSAJE, OUT_CODIGO, OUT_VALOR } = "";
    const sql = `CALL SP_CRUD_ORG(?,?,?,?,?,?,?,?,?,@OUT_MENSAJE,@OUT_CODIGO,@OUT_VALOR); SELECT @OUT_MENSAJE,@OUT_CODIGO,@OUT_VALOR;`;
    db.query(sql, [ORGA_IN_CODIGO, ORGA_VC_NUMERO, ORGA_VC_SIGLA, ORGA_VC_NOMBRE, ORGA_VC_DIRECCION,
        ORGA_FG_ESTADO, AUDI_IN_USER, AUDI_VC_USER, AUDI_VC_TERMINAL], function (err, rows) {
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

const org_update = async (req, res) => {
    console.log("/api/org_update/:id");
    let { ORGA_VC_NUMERO, ORGA_VC_SIGLA, ORGA_VC_NOMBRE, ORGA_VC_DIRECCION,
         ORGA_FG_ESTADO, AUDI_IN_USER, AUDI_VC_USER, AUDI_VC_TERMINAL } = req.body;
    let { id } = req.params;
    let ORGA_IN_CODIGO = id;
    let { OUT_MENSAJE, OUT_CODIGO, OUT_VALOR } = "";    
    const sql = `CALL SP_CRUD_ORG(?,?,?,?,?,?,?,?,?,@OUT_MENSAJE,@OUT_CODIGO,@OUT_VALOR); SELECT @OUT_MENSAJE,@OUT_CODIGO,@OUT_VALOR;`;
    db.query(sql, [ORGA_IN_CODIGO,ORGA_VC_NUMERO, ORGA_VC_SIGLA, ORGA_VC_NOMBRE, ORGA_VC_DIRECCION,       
        ORGA_FG_ESTADO, AUDI_IN_USER, AUDI_VC_USER, AUDI_VC_TERMINAL], function (err, rows) {
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
    rol_findall,      // buscar por rol  
    bandeja_findall,      // buscar bandeja en la lista del crud    
    bandeja_insert,    // insertar bandeja
    bandeja_update     // actualiza bandeja
}