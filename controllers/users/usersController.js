const db= require('./../../database/db');

const bcrypt= require('bcrypt');

module.exports ={

    newUser: async (req,res) => { 
        let password = await bcrypt.hash(req.body.USER_VC_PASSWORD,10);
        db.query(`
            INSERT INTO SEG_USER (
                USER_VC_LOGIN,
                USER_VC_PASSWORD, 
                USER_VC_NRODOC,
                USER_VC_CORREO,
                USER_VC_NOMBRE, 
                USER_VC_PATERNO,
                USER_VC_MATERNO,
                USER_VC_TELEFONO,
                USER_VC_OBSERVACIONES
            ) VALUES (
                ${db.escape(req.body.USER_VC_LOGIN)},
                ${db.escape(password)},
                ${db.escape(req.body.USER_VC_NRODOC)},
                ${db.escape(req.body.USER_VC_CORREO)},
                ${db.escape(req.body.USER_VC_NOMBRE)},
                ${db.escape(req.body.USER_VC_PATERNO)},
                ${db.escape(req.body.USER_VC_MATERNO)},
                ${db.escape(req.body.USER_VC_TELEFONO)},
                ${db.escape(req.body.USER_VC_OBSERVACIONES)}
                
            );
            `,
            /*PERF_IN_CODIGO            
            ${db.escape(req.body.perfil)}*/
            (err,result)=>{
                if(err){
                    //throw err;
                    return res.status(400).json(err);
                }
                if(result){
                    return res.status(201).json({
                        message:"Nuevo usuario creado",
                    })   
                }
            }
        )
    },

    getUsers: (req,res) => {
        
        console.log("POST [/api/seg_users]");
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

        console.log("req.parametro : " + filter_parseado);

        let query = "SELECT U.* FROM SEG_USER U"; // query que va ir armandose
        let query_count = "SELECT COUNT(*) AS TOTAL FROM SEG_USER U"; // total de registros de la tabla
        let query_limit = "  LIMIT " + offset + "," + pageSize;  // traer solo data en este rango
        let where = "" ;
        if(filter_nombres) where+=` WHERE (U.USER_VC_NOMBRE LIKE ${db.escape('%'+filter_nombres+'%',true)}
            OR U.USER_VC_PATERNO LIKE ${db.escape('%'+filter_nombres+'%',true)}
            OR U.USER_VC_MATERNO LIKE ${db.escape('%'+filter_nombres+'%',true)})
        `;
        let ordenar = "";
        if (sortField != undefined) {
            ordenar = ordenar + " ORDER BY U." + sortField + " " + sortOrder;
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
    },

    editUser: (req,res) => {
        db.query(
            `SELECT * FROM SEG_USER 
            WHERE USER_IN_CODIGO = ${db.escape(req.params.id)};`,
            async (err,result)=>{
                if(err){
                    throw err;
                    return res.status(400).json(err);
                }
                
                if(result.length){
                
                    let user= result[0];

                    let USER_VC_LOGIN= req.body.USER_VC_LOGIN?req.body.USER_VC_LOGIN:user.USER_VC_LOGIN;
                    let USER_VC_NRODOC= req.body.USER_VC_NRODOC?req.body.USER_VC_NRODOC:user.USER_VC_NRODOC;
                    let USER_VC_CORREO= req.body.USER_VC_CORREO?req.body.USER_VC_CORREO:user.USER_VC_CORREO;
                    let USER_VC_NOMBRE= req.body.USER_VC_NOMBRE?req.body.USER_VC_NOMBRE:user.USER_VC_NOMBRE;
                    let USER_VC_PATERNO= req.body.USER_VC_PATERNO?req.body.USER_VC_PATERNO:user.USER_VC_PATERNO;
                    let USER_VC_MATERNO= req.body.USER_VC_MATERNO?req.body.USER_VC_MATERNO:user.USER_VC_MATERNO;
                    let USER_VC_TELEFONO= req.body.USER_VC_TELEFONO?req.body.USER_VC_TELEFONO:user.USER_VC_TELEFONO;
                    let USER_VC_OBSERVACIONES= req.body.USER_VC_OBSERVACIONES?req.body.USER_VC_OBSERVACIONES:user.USER_VC_OBSERVACIONES;

                    let password = req.body.USER_VC_PASSWORD?await bcrypt.hash(req.body.USER_VC_PASSWORD,10):user.USER_VC_PASSWORD;

                    db.query(`
                    UPDATE SEG_USER SET
                    UPDATE SEG_USER SET
                        USER_VC_PASSWORD=${db.escape(password)},
                        USER_VC_LOGIN=${db.escape(USER_VC_LOGIN)},
                        USER_VC_NRODOC=${db.escape(USER_VC_NRODOC)},
                        USER_VC_CORREO=${db.escape(USER_VC_CORREO)},
                        USER_VC_NOMBRE=${db.escape(USER_VC_NOMBRE)},
                        USER_VC_PATERNO=${db.escape(USER_VC_PATERNO)},
                        USER_VC_MATERNO=${db.escape(USER_VC_MATERNO)},
                        USER_VC_TELEFONO=${db.escape(USER_VC_TELEFONO)},
                        USER_VC_OBSERVACIONES=${db.escape(USER_VC_OBSERVACIONES)}
                    `,
                    //PERF_IN_CODIGO=${db.escape(req.body.perfil)}
                    (err,result)=>{
                        if(err){
                            throw err;
                            return res.status(400).json(err);
                        }
                        
                        return res.status(201).json({
                            message:"Usuario editado exitosamente",
                        })   
                        
                    })
                }

                else return res.status(404).json({
                    message:"Usuario no encontrado",
                })
            }
        )
    },

    deleteUser: (req,res)=>{
        db.query(
            `SELECT * FROM SEG_USER 
            WHERE USER_IN_CODIGO = ${db.escape(req.params.id)};`,
            (err,result)=>{
                if(err){
                    throw err;
                    return res.status(400).json(err);
                }
                
                if(result.length){
            
                    db.query(`
                        DELETE FROM SEG_USER WHERE USER_IN_CODIGO = ${req.params.id}
                    `,(err,result)=>{
                        if(err){
                            throw err;
                            return res.status(400).json(err);
                        }
                        
                        return res.status(201).json({
                            message:"Usuario eliminado exitosamente",
                        })         
                    })
                }

                else return res.status(404).json({
                    message:"Usuario no encontrado",
                })
            }
        )
    },

}


/*

        let numRows;
        let queryPagination;
        let numPerPage = parseInt(req.query.per_page, 10) || 10;
        let page = parseInt(req.query.page, 10) || 0;
        let filter = req.query.filter || "USER_IN_CODIGO";
        let order = req.query.order&&req.query.order==="ASC"?"ASC":"DESC";
        let lastPage;
        let skip=0;
        if(page>1) skip = (page-1) * numPerPage;
        let limit = skip + ',' + numPerPage;
        
        let profile = req.query.profile || null;
        let profileLabel="";

        if(profile&&typeof profile === 'string'&&profile!='') {
            profileLabel = ` WHERE PERF_IN_CODIGO LIKE ${db.escape('%'+profile+'%',true)}`;
        }
        
        let name = req.query.name || null;
        let nameLabel="";
        if(name&&typeof name === 'string'&&name!='') {
            nameLabel = ` 
                WHERE USER_VC_NOMBRE LIKE ${db.escape('%'+name+'%',true)}
                OR USER_VC_PATERNO LIKE ${db.escape('%'+name+'%',true)}
                OR USER_VC_MATERNO LIKE ${db.escape('%'+name+'%',true)}
            `;
        }

        db.query("SELECT count(*) as numRows from SEG_USER "+profileLabel+nameLabel,
        (err,result, fields)=>{

            if(err) {
                console.log("error",err)
                return res.status(400).json(err);
            }

            numRows= result[0].numRows;

            lastPage = Math.ceil(numRows / numPerPage);

            db.query(`
            SELECT * FROM SEG_USER 
            ${profileLabel}
            ${nameLabel}
            ORDER BY ${db.escapeId(filter.toUpperCase())}  ${order}
            LIMIT ${limit}
            `,
            (err,result)=>{

                if(err) {
                    console.log("error",err)
                    return res.status(500).json(err);
                }

                if (page <= lastPage) {
                  let responsePayload = {
                    data:result,
                    currentPage: page,
                    perPage: numPerPage,
                    lastPage
                  };

                  return res.status(200).json(responsePayload);
                }
                else return res.status(400).json({
                  message: 'La consulta excede el número de páginas(' + lastPage + ')',
                })
            });

        })
*/