const express = require('express');

const app = express();

let { verificaToken } = require('../middlewares/autenticacion');
const Producto = require('../models/producto');
const { json } = require('body-parser');
const bodyParser = require('body-parser');


// =================
// buscar productos
// =================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('descripcion')
        .populate('usuario', 'name')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.countDocuments((err, total) => {
                res.json({
                    ok: true,
                    productos,
                    total
                })
            })

        })

});



// =================
// Buscar producto
// =================
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'name')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productoDB
            })
        });
});

// =================
// Busqueda
// =================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            });

        });

});

// =================
// Crear Producto
// =================
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productoDB
        })
    })
})


// ========================
// Modificar un producto
// ========================
app.put('/producto/:id', verificaToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;

    let update = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
    }

    Producto.findByIdAndUpdate(id, update, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});


// =================
// Eliminar producto
// =================
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productoDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'El producto fue desactivado con exito.'
        })
    })
})















module.exports = app;