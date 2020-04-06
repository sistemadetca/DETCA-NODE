//Routes Import-Export
const express = require('express');
const router = express.Router();

//Rutas url usuario pueda ver
router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/chart', (req, res) => {
    res.render('chart');

});
module.exports = router;
