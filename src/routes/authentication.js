const express = require("express");
const router = express.Router();

const passport = require("passport");//Exportando todo la carpeta passport
const { isloggedIn, isNotLoggedin} = require("../lib/auth");//Solicitando el archivo auth con el metodo para el cierre de sesion

//Registro de usuario
router.get("/signup", isNotLoggedin, (req, res) => { //RENDERIZAR DATOS, Objeto para el usuario ya esta logeado y no tenga acceso al registro
    res.render("auth/signup");
});

router.post("/signup", isNotLoggedin ,passport.authenticate("local.signup", {//EJECUTA informacion del ussuario
    successRedirect: "/signin",//se envia una vista cuando se loggea correctamente
    failureRedirect: "/signup",// Por si succede algun error en el loggueo
    failureFlash: true //Se envias los datos del cliente
}));

//Inicio session
router.get("/signin", isNotLoggedin, (req, res) => {//renderiza desde el get signin
    res.render("auth/signin");//Lo muestra en el server el login
});

router.post("/signin", isNotLoggedin,(req, res, next) => {

    passport.authenticate("local.signin", {//Validar el inicio session
        successRedirect: "/profile",//usuario loggeado correctamente pueda ser redireccionado a la siguiente pestaña
        failureRedirect: "/signin",//Sino se loguea correctamente , me regrese nuevamente al login 
        failureFlash: true//Me envie mensajes en pantalla del error
    })(req, res, next);
});    
//Vista del perfil cuando inicie sesion
router.get("/profile", isloggedIn, (req, res) => {
    res.render("profile")
});

//cerrar sesion 

router.get("/logout", isloggedIn ,(req, res) => {
    req.logOut();
    res.redirect("/signin");

});

module.exports = router;