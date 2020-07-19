const jwt = require('jsonwebtoken');

// ============================
//      Verificar TOken
// ============================

let verificaToken = (req, res, next) => {

    let authorization = req.get('authorization');

    jwt.verify(authorization, process.env.SEED, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decode.usuario;
        next();

    });

};


// ============================
//      Verificar Role_Admin
// ============================
let verificaAdmin = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No esta autorizado para realizar esta accion.'
            }
        });
    }



};


// ============================
//      Verificar Token Img
// ============================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decode.usuario;
        next();

    });
}

module.exports = {
    verificaToken,
    verificaAdmin,
    verificaTokenImg
}