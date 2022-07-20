const itemController = require('../controllers/item-controller');

module.exports = {
    exist: (req, res, next) => {
        const data = itemController.findItem(req.params.id);
        if(data){
            next()
        } else {
            return res.status(400).json({
                status: "Data tidak ditemukan"
            });
        }
    }
}