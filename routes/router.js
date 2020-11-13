const express= require('express');

const router = express.Router();

const authMiddleware= require('./../middleware/auth/auth');

const authController= require('./../controllers/auth/authController');

const documentsController= require('./../controllers/documents/documentsController'); // cochoa cambiado para poder correglo

const usersController = require('./../controllers/users/usersController');
const parmaeController = require('./../controllers/util/parmaeController');
const administradoController = require('./../controllers/administrados/administradoController');
const orgController = require('./../controllers/orgController');

router.post('/users/login', authMiddleware.validateLogin, authController.login);

router.post('/users', authController.signup);

router.get('/users/me', authMiddleware.validateJwt , authController.me);

router.post('/documents', authMiddleware.validateJwt, documentsController.newDocument); // cochoa cambiado para poder correglo

router.get('/documents', authMiddleware.validateJwt, documentsController.getDocs);  // cochoa cambiado para poder correglo

router.get('/documents/:id', documentsController.getReport); // cochoa cambiado para poder correglo

//ese eror es una advertencia, no afecta nada, solo es un logger que no fue instalado

router.get('/seg_users', authMiddleware.validateJwt, usersController.getUsers);

router.post('/seg_users', authMiddleware.validateJwt, usersController.newUser);

router.put('/seg_users/:id', authMiddleware.validateJwt, usersController.editUser);

router.delete('/seg_users/:id', authMiddleware.validateJwt, usersController.deleteUser);

/*------------- INICIO CPM_PARMAE ------------------*/
router.get('/parmae_get_clave', authMiddleware.validateJwt, parmaeController.parmae_get_clave);
/*------------- FIN CPM_PARMAE ------------------*/
/*------------- INICIO ADMINISTRADO ------------------*/
router.post('/administrado_insert', authMiddleware.validateJwt, administradoController.administrado_insert);
router.get('/administrado_findall', authMiddleware.validateJwt, administradoController.administrado_findall);
router.put('/administrado_update/:id', authMiddleware.validateJwt, administradoController.administrado_update);
/*------------- FIN ADMINISTRADO ------------------*/
/*------------- INICIO ORG ------------------*/
router.post('/org_insert', authMiddleware.validateJwt, orgController.org_insert);
router.get('/org_findall', authMiddleware.validateJwt, orgController.org_findall);
router.put('/org_update/:id', authMiddleware.validateJwt, orgController.org_update);
/*------------- FIN ORG ------------------*/

module.exports= router;

