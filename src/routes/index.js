//Routes Import-Export
const express = require('express');
const router = express.Router();
const { isloggedIn } = require("../lib/auth");

//Rutas url usuario pueda ver
router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/chart', isloggedIn, (req, res) => {
    res.render('chart');

});
module.exports = router;
