const bcrypt= require('bcrypt');

const db= require('./../../database/db');

const jwt = require('jwt-simple');

module.exports={

    login:(req,res)=>{

        db.query(
            `SELECT * FROM SEG_USER 
            WHERE LOWER(USER_VC_LOGIN) = LOWER(${db.escape(req.body.username)})
            OR LOWER(USER_VC_CORREO) = LOWER(${db.escape(req.body.username)});`,
            (err,result)=>{
                if(err){
                    throw err;
                    return res.status(400).json(err);
                }
                if(!result.length){
                
                    return res.status(404).json({
                        message:"Este usuario no existe",
                    })
                    
                }
                let user= result[0];
 
                bcrypt.compare(
                    req.body.password,
                    user.USER_VC_PASSWORD,
                    (bErr, bResult)=>{
                        if(bErr){
                            throw bErr;
                            return res.status(400).json(bErr);
                        }

                        if(bResult){
                            const token = jwt.encode({
                                id: user.USER_IN_CODIGO,
                                username:user.USER_VC_LOGIN,
                                password:user.USER_VC_PASSWORD
                            }, process.env.SECRET_KEY_JWT);

                            return res.status(200).json({
                                message:"Sesión iniciada!",
                                token,
                                user,
                            });
                        }

                        return res.status(401).json({
                            message:"Usuario o contraseña inválidos",
                        })
                    }
                );
                
            }
        )
        
    },

    signup:(req,res)=>{
        db.query(
            `SELECT * FROM SEG_USER 
            WHERE LOWER(USER_VC_LOGIN) = LOWER(${db.escape(req.body.username)})
            OR LOWER(USER_VC_CORREO) = LOWER(${db.escape(req.body.email)});`,
            (err,result)=>{
                if(err){
                    throw err;
                    return res.status(400).json(err);
                }
                
                if(result.length){
                
                    console.log(result);

                    return res.status(404).json({
                        message:"Este usuario ya ha sido registrado",
                    });
                    
                }

                bcrypt.hash(req.body.password,10,(hErr,hash)=>{

                    if(hErr){
                        return res.status(500).json({
                            message:'Error en la base de datos',
                        });
                    }

                    else{
                        db.query(
                            `INSERT INTO SEG_USER (USER_VC_LOGIN, USER_VC_PASSWORD, USER_VC_CORREO, USER_VC_NOMBRE)
                            VALUES (${db.escape(req.body.username)},${db.escape(hash)}, ${db.escape(req.body.email)},${db.escape(req.body.fullname)});`,
                            (dbErr,dbResult)=>{
                                if(dbErr){
                                    throw dbErr;
                                    return res.status(400).json(dbErr);
                                }

                                return res.status(201).json({
                                    message:"Usuario registrado exitosamente!",
                                    token:jwt.encode({
                                        username:req.body.username,                                        
                                        id: dbResult.insertId,
                                    },process.env.SECRET_KEY_JWT),
                                })
                            }
                        )
                    }

                })

            });
    },

    me: (req,res)=>{
        return res.status(200).json(req.user)
    }

}