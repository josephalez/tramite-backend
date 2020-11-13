const db= require('./../../database/db');

const jasper = require('node-jasper')({
    path: process.env.JASPER,
    reports: {
        hojaRuta: {
            jasper: './../../reports/hojaruta.jasper' //la plantilla provisional generada
        }
    }
});

module.exports ={

    newDocument: (req,res) => {
        db.query(`
            INSERT INTO documents (
                nro_tramite,
                tipo, 
                destino,
                folios,
                asunto,
                administrado,
                registro,
                estado
            ) VALUES (
                ${db.escape(req.body.nro_tramite)},
                ${db.escape(req.body.tipo)},
                ${db.escape(req.body.destino)},
                ${db.escape(req.body.folios)},
                ${db.escape(req.body.asunto)},
                ${db.escape(req.body.administrado)},
                ${db.escape(req.body.registro)},
                ${db.escape(req.body.estado)} 
            );
            `,
            (err,result)=>{
                if(err){
                    throw err;
                    return res.status(400).json(err);
                }
                if(!result.length){
                
                    return res.status(201).json({
                        message:"Documento emitido exitosamente",
                    })   
                }
            }
        )
    },
 
    getDocs: (req,res) => {
        
        let numRows;
        let queryPagination;
        let numPerPage = parseInt(req.query.per_page, 10) || 10;
        let page = parseInt(req.query.page, 10) || 0;
        let filter = req.query.filter || "ID";
        let order = req.query.order&&req.query.order==="ASC"?"ASC":"DESC";
        let lastPage;
        let skip=0;
        if(page>1) skip = (page-1) * numPerPage;
        let limit = skip + ',' + numPerPage;

        let estado= req.query.estado || null
        let estadoLabel=""

        let asunto= req.query.asunto || null
        let asuntoLabel=""

        
        if(estado&&typeof estado === 'string'&&estado!='') {
            estadoLabel = ` WHERE estado LIKE ${db.escape('%'+estado+'%',true)}`;
        }

        if(asunto&&typeof asunto === 'string'&&asunto!='') {
            asuntoLabel = ` WHERE asunto LIKE ${db.escape('%'+asunto+'%',true)}`;
        }

        db.query("SELECT count(*) as numRows from documents ",
        (err,result)=>{

            if(err) {
                console.log("error",err)
                return res.status(400).json(err);
            }

            numRows= result[0].numRows;

            lastPage = Math.ceil(numRows / numPerPage);

            db.query(`
                SELECT * FROM documents 
                ORDER BY ${db.escapeId(filter.toUpperCase())}  ${order} LIMIT ${limit} 
                ${estadoLabel}
                ${asuntoLabel}
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
    },

    getReport:(req,res)=>{
        db.query(
            `SELECT * FROM documents;`,
            (err,result)=>{
                if(err){
                    throw err;
                    return res.status(500).json(err);
                }
                
                if(result.length){
            
                    let document= result[0];

                    console.log('doc', document);

                    try {
                            
                        let report = {
                            report: 'hojaRuta',
                            data: {
                                nro_tramite:document.nro_tramite?document.nro_tramite:'No Disponible',
                                tipo:document.tipo?document.tipo:'No Disponible',
                                destino:document.destino?document.destino:'No Disponible',
                                folios:document.folios?document.folios:'No Disponible',
                                administrado:document.administrado?document.administrado:'No Disponible',
                                registro:document.registro?document.registro.toLocaleString('es'):'No Disponible',
                                estado:document.estado?document.estado:'No Disponible',
                                asunto:document.asuno?document.asunto:'No Disponible',
                            },
                        };
                        let pdf = jasper.pdf(report);
                        res.set({
                            'Content-type': 'application/pdf',
                            'Content-Length': pdf.length
                        });
                        res.send(pdf);

                    } catch (error) {
                        console.log('JASPER ERR',error);
                    }
                    
                }

                else return res.status(404).json({
                    message:"Documento no encontrado",
                })
            }
        )
    }
}