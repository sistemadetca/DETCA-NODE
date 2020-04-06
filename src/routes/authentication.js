const express = require("express");
const router = express.Router();

const passport = require("passport");//Exportando todo la carpeta passport

router.get("/signup", (req, res) => { //RENDERIZAR DATOS
    res.render("auth/signup");
});

router.post("/signup", passport.authenticate("local.signup", {//EJECUTA informacion del ussuario
    successRedirect: "/signin",//se envia una vista cuando se loggea correctamente
    failureRedirect: "/signup",// Por si succede algun error en el loggueo
    failureFlash: true //Se envias los datos del cliente
}));

router.get("/signin", (req, res) => {//renderiza desde el get signin
    res.render("auth/signin");//Lo muestra en el server el login
});

router.post("/signin", (req, res, next) => {

    passport.authenticate("local.signin", {//Validar el inicio session
        successRedirect: "/profile",//usuario loggeado correctamente pueda ser redireccionado a la siguiente pestaña
        failureRedirect: "/signin",//Sino se loguea correctamente , me regrese nuevamente al login 
        failureFlash: true//Me envie mensajes en pantalla del error
    })(req, res, next);
});    

router.get("/profile", (req, res) => {
    res.render("profile")
});
module.exports = router;