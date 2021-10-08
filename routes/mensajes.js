
/*
        path : /api/mensajes
*/

const { Router } = require('express');
const { obtenerChat } = require('../controllers/mensaje');
const { validarJWT } = require('../middlewares/validar-jwt');



const router = Router();



//
router.get('/:de', validarJWT, obtenerChat);

module.exports = router;