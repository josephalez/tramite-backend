const jwt= require('jwt-simple');

const db= require('./../../database/db');

module.exports={

    validateJwt: (req,res,next)=>{
        try {

            const token = req.headers.authorization.split(' ')[1];

            const decoded= jwt.decode(token,process.env.SECRET_KEY_JWT);

            console.log("user decoded", decoded);

            db.query(
            `SELECT * FROM SEG_USER WHERE LOWER(USER_VC_LOGIN) = LOWER(${db.escape(decoded.username)});`,
            (err,result)=>{
                if(err){
                    console.log('err',err)
                    return res.status(400).json(err);
                }
                
                if(result.length){
                         
                    req.user=result[0];

                    next();
                    
                }

                else{
                    return res.status(401).json({
                        message:"autenticación inválida",
                    })
                }

            });
            
        } catch (error) {

            console.log('jwt err', error);

            return res.status(401).json({
                message:"Sesión inválida",
            })
        }
    },

    validateLogin: (req,res,next)=>{

        if(!req.body.username||!req.body.password){
            return res.status(400).json({
                message:`Rellene los campos 'correo/nombre de usuario' y 'contraseña'`,
            });
        }

        next(); 

    },

    validateSignup: (req,res,next)=>{

        if(!req.body.username||!req.body.email||!req.body.password){
            return res.status(400).json({
                message:`Rellene los campos 'correo', 'nombre de usuario' y 'contraseña'`,
            });
        }

        if (!req.body.password&&!req.password.passwordConfirmation){
            return res.status(400).json({
                message:'las contraseñas no coinciden',
            });
        }

        if(!req.body.fullname) req.body.fullname=null;

        next();

    }

}