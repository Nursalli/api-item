const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const itemController = require('../controllers/item-controller');
const existMiddleware = require('../middleware/exist');

router.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
    // res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    next(); 
})

router.get('/', itemController.index);

router.get('/:id',
    existMiddleware.exist,
    itemController.find);

router.post('/', 
    [
        body('foto_barang').custom( (data, { req }) => {
            const type = req.files.foto_barang.mimetype.split('/')[1].toLowerCase();
            const size = req.files.foto_barang.size;

            if(type !== 'jpg' && type !== 'jpeg' && type !== 'png'){
                throw new Error('Type file tidak valid!');
            } else if (size > 100000){
                throw new Error('Ukuran foto tidak valid, maksimal 100kb!');
            } else {
                return true;
            }
            
        }),
        body('nama_barang').notEmpty(),
        body('nama_barang').custom(data => {
            const checkDuplicate = itemController.duplicate(data);

            if(checkDuplicate){
                throw new Error('Nama sudah digunakan');
            }else{
                return true;
            }
        }),
        body('harga_beli').isNumeric(),
        body('harga_jual').isNumeric(),
        body('stok').isNumeric(),
    ],
    itemController.validator,
    itemController.create);

router.put('/:id',
    existMiddleware.exist,
    [
        body('foto_barang').custom( (data, { req }) => {
            if(data !== '' || req.files){
                const type = req.files.foto_barang.mimetype.split('/')[1].toLowerCase();
                const size = req.files.foto_barang.size;

                if(type !== 'jpg' && type !== 'jpeg' && type !== 'png'){
                    throw new Error('Type file tidak valid!');
                } else if (size > 100000){
                    throw new Error('Ukuran foto tidak valid, maksimal 100kb!');
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }),
        body('nama_barang').notEmpty(),
        body('nama_barang').custom( (data, { req }) => {
            const dataOld = itemController.findItem(req.params.id);
            if(data !== dataOld.nama_barang){
                const checkDuplicate = itemController.duplicate(data);

                if(checkDuplicate){
                    throw new Error('Nama sudah digunakan');
                }else{
                    return true;
                }
            } else {
                return true;
            }
        }),
        body('harga_beli').isNumeric(),
        body('harga_jual').isNumeric(),
        body('stok').isNumeric(),
    ],
    itemController.validator,
    itemController.update);

router.delete('/:id',
    existMiddleware.exist,
    itemController.destroy);

module.exports = router;

