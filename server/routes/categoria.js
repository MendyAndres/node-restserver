const express = require('express');
const _ = require('underscore');

let { verificaToken, verificaAdmin } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');
const { json } = require('body-parser');


const app = express();


//==============================
// Muestra todas las categorias
//==============================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'name email')
        .exec((err, categorias) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }

            Categoria.countDocuments((err, total) => {
                res.json({
                    ok: true,
                    categorias,
                    total
                })
            })

        })
});

//==============================
// Muestra una las categorias
//==============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria
        })

    })

});

//==============================
// Crea nueva categoria
//==============================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })
});


//==============================
// Modificar una categoria 
//==============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });

});

//==============================
// Muestra todas las categorias
//==============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })
    })
});


module.exports = app;