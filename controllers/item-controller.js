const fs = require('fs');
const { validationResult } = require('express-validator');
const randomstring = require('randomstring');

const listItem = () => {
    const file = fs.readFileSync('db/item.json', 'utf8');
    return JSON.parse(file);
}

const findItem = (id) => {
    const dataItem = listItem();
    return dataItem.find(item => item.id === Number(id));
}

const saveItem = (data) => {
    fs.writeFileSync('db/item.json', JSON.stringify(data));
}

module.exports = {
    validator: (req, res, next) => {
        const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array()
                })
            } else {
                next()
            }
    },
    duplicate: (namaBarang) => {
        const dataItem = listItem();
        return dataItem.find(item => item.nama_barang === namaBarang);
    },
    findItem: (id) => {
        const dataItem = listItem();
        return dataItem.find(item => item.id === Number(id));
    },
    index: (req, res) => {
        const data = listItem();
        res.status(200).json(data);
    },
    find: (req, res) => {
        const data = findItem(Number(req.params.id));
        res.status(200).json(data);
    },
    create: (req, res) => {
        const data = listItem();

        let file = req.files.foto_barang;
        const fileName = randomstring.generate(5) + '.' + req.files.foto_barang.mimetype.split('/')[1].toLowerCase();

        const uploadPath = process.env.PATH_IMAGES || './public/images/' + fileName;

        file.mv(uploadPath, function(err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            const id = (data.length === 0) ? 1 : data[data.length - 1].id + 1;

            const dataItem = {
                id,
                foto_barang: fileName,
                nama_barang: req.body.nama_barang,
                harga_beli: Number(req.body.harga_beli),
                harga_jual: Number(req.body.harga_jual),
                stok: Number(req.body.stok) 
            }

            data.push(dataItem);

            saveItem(data);

            res.status(200).json({ status: 'Data barang berhasil ditambahkan' });
        });
    },
    update: (req, res) => {
        const data = listItem();

        let searchItem = findItem(req.params.id);

        let newData = {};
        
        if(req.files){
            const filePath = process.env.PATH_IMAGES || './public/images/' + searchItem.foto_barang;

            fs.unlinkSync(filePath);

            let file = req.files.foto_barang;
            const fileName = randomstring.generate(5) + '.' + req.files.foto_barang.mimetype.split('/')[1].toLowerCase();

            const uploadPath = process.env.PATH_IMAGES || './public/images/' + fileName;

            file.mv(uploadPath, function(err) {
                if (err) {
                    return res.status(500).json({
                        error: err.message
                    });
                }
            });

            newData = {
                foto_barang: fileName,
                nama_barang: req.body.nama_barang,
                harga_beli: Number(req.body.harga_beli),
                harga_jual: Number(req.body.harga_jual),
                stok: Number(req.body.stok)
            }
        } else {
            newData = {
                nama_barang: req.body.nama_barang,
                harga_beli: Number(req.body.harga_beli),
                harga_jual: Number(req.body.harga_jual),
                stok: Number(req.body.stok)
            }
        }

        searchItem = { ...searchItem, ...newData }

        const postNewData = data.map(d => d.id === searchItem.id ? searchItem : d);

        saveItem(postNewData);

        res.status(200).json({ status: 'Data barang berhasil diubah' });
    },
    destroy: (req, res) => {
        const data = listItem();

        let searchItem = findItem(req.params.id);

        const filePath = process.env.PATH_IMAGES || './public/images/' + searchItem.foto_barang;

        fs.unlinkSync(filePath);

        const postAfterDeleteData = data.filter(d => d.id !== Number(req.params.id));

        saveItem(postAfterDeleteData);

        res.status(200).json({ status: 'Data barang berhasil dihapus' });
    }
}