const bcrypt = require('bcrypt');
const db = require('../../database/db');
const jwt = require('jwt-simple');

const parmae_get_clave = async (req, res) => {
    let CPM_VC_CLAVE = req.query.CPM_VC_CLAVE;   
    let query = "SELECT * FROM V_CPM_PARMAE WHERE CPM_VC_CLAVE = '" + CPM_VC_CLAVE + "'";
    console.log("[api/get_parmae_clave] " + query);
    db.query(query, (err, result) => {
        if (err) {
            console.log("error", err)
            return res.status(400).json(err);
        }                        
        return res.status(200).json(result);        
    });
}

module.exports = {
    parmae_get_clave,      // buscar por tipo de clave
}