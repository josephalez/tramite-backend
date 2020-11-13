const db= require('./../database/db');

module.exports={

    newMessage: (socket,data, successCb) => {
        try {
            let userId = socket.user?socket.user.USER_IN_CODIGO:null;

            if(!userId) socket.emit('on-error');
            
            if(userId==data.user2) socket.emit('on-error');

            else db.query(`
                INSERT INTO MENSAJES (
                    user,
                    user2,
                    message
                ) VALUES (
                    ${db.escape(userId)},
                    ${db.escape(data.user2)},
                    ${db.escape(data.message)}
                );    
            `, (err,result)=>{
                console.log(result);
                if(err) socket.emit('on-error');
                else if(result){
                    db.query(`SELECT M.*, 
                        CONCAT_WS(' ', U.USER_VC_NOMBRE, U.USER_VC_PATERNO) AS username, 
                        CONCAT_WS(' ', U2.USER_VC_NOMBRE, U2.USER_VC_PATERNO) AS username2
                        FROM MENSAJES M 
                        JOIN SEG_USER U ON M.user = U.USER_IN_CODIGO 
                        JOIN SEG_USER U2 ON M.user2 = U2.USER_IN_CODIGO
                        WHERE id=${db.escape(result.insertId)}`,
                    (err,res)=>{
                        if(err) socket.emit('on-error');
                        else if(res.length){
                            socket.emit('message-add', res[0]);
                            successCb(res[0]);
                        }
                        else socket.emit('on-error');
                    })
                }else{
                    socket.emit('on-error');
                }
            })
        } catch (error) {
            console.log(error);
            socket.emit('on-error');
        }
    },

    getUsersList: async(socket)=>{
        try {

            console.log('users');

            db.query(`
                SELECT CONCAT_WS(' ', U.USER_VC_NOMBRE, U.USER_VC_PATERNO) AS username,
                U.USER_IN_CODIGO AS id
                FROM SEG_USER U
            `, (err,result)=>{

                if(err) socket.emit('on-error', err);

                console.log(result)

                if(result){
                    socket.emit('users', result);
                }

                else{
                    socket.emit('on-error', {'error':"No hay Usuarios"});
                }

            });
        
        } catch (error) {
            socket.emit('on-error')
        }
    },

    getMessagesList: async(socket)=>{
        try {

            console.log('messages');

            db.query(`
                SELECT M.*, 
                CONCAT_WS(' ', U.USER_VC_NOMBRE, U.USER_VC_PATERNO) AS username, 
                CONCAT_WS(' ', U2.USER_VC_NOMBRE, U2.USER_VC_PATERNO) AS username2
                FROM MENSAJES M 
                JOIN SEG_USER U ON M.user = U.USER_IN_CODIGO 
                JOIN SEG_USER U2 ON M.user2 = U2.USER_IN_CODIGO
                WHERE (
                    M.user = ${db.escape(socket.user.USER_IN_CODIGO)}
                    OR M.user2 = ${db.escape(socket.user.USER_IN_CODIGO)}
                )
            `, (err,result)=>{

                if(err) socket.emit('on-error', err);

                if(result.length){
                    socket.emit('messages', result);
                }

                else{
                    socket.emit('on-error', {'error':"No hay Mensajes"});
                }

            });
        
        } catch (error) {
            socket.emit('on-error')
        }
    },

    validateJwtSocket: async (socket,decoded)=>{
        try{
            console.log("user decoded", decoded);

            await db.query(
            `SELECT * FROM SEG_USER WHERE LOWER(USER_VC_LOGIN) = LOWER(${db.escape(decoded.username)});`,
            (err,result)=>{
                if(err){
                    console.log('err',err)
                    socket.disconnect();
                }
                
                if(result.length){
                        
                    //console.log(result[0]);
                    
                    socket.user=result[0];
                 
                    console.log(socket.user);

                    socket.join('to-'+socket.user.USER_IN_CODIGO);
                    
                    socket.emit('auth');
                    
                }

                else{
                    socket.disconnect();
                }

            });
            
        } catch (error) {

            console.log('jwt err', error);

            return socket.disconnect();;
        }
    },

}