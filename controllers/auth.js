const { response } = require('express');
const bcrypt = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../jwt/jwt');
const usuario = require('../models/usuario');

const crearUsuario = async (req, res = response) => {


    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });


        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // encriptar contraseña

        const salt = bcrypt.genSaltSync();

        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();


        // generar mi json web token JWT

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });

    }



}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe, verifique los datos ingresados'
            });
        }

        // validad password

        const validarPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validarPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La constraseña no es correcta, intentelo de nuevo'
            });
        }

        // generar el JWT

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });



    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

    return res.json({
        ok: true,
        msg: 'login'
    });
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    const nuevoJWT = await generarJWT(uid);

    const usuarioUID = await Usuario.findById( uid );


    res.json({
        ok: true,
        usuarioUID,
        nuevoJWT
    });

}

module.exports = {
    crearUsuario,
    login,
    renewToken
}