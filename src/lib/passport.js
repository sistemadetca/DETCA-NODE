const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy;

const pool = require("../database");//sE LLAMA LA DB
const helpers = require("../lib/helpers"); //Se le indica donde esta la carptea lib y la pueda usar

//Login
passport.use("local.signin", new LocalStrategy({//Metodo para el inicio de sesion
    usernameField: "correo",
    passwordField: "contraseña_us",
    passReqToCallback: true
}, async (req, correo, contraseña_us, done) => {
    const rows = await pool.query('SELECT * FROM tbl_usuario WHERE correo = ?', [correo]);//Consulta a la BD si el usuario o correo coinciden
    if (rows.length > 0) {//
        const user = rows[0];//SE GUARDE EL USUARIO
        const validPassword = await helpers.matchPassword(contraseña_us, user.contraseña_us) //LO GUARDA Y VALIDA LA CONSTRASEÑA
        if (validPassword) {
            done(null, user, req.flash("success", "Bienvenido" + user.correo));//Si todo es validado , se ingrese al y le de un mensaje de bienvenida 
        } else {//De lo contrario
            done(null, false, req.flash("message", "contraseña incorrecta"));//Se imprima 
        }
    } else { //si no existe el usuario
        return done(null, false, req.flash("alert", "El correo no existe"));//Mensaje
    }
}));

//Registro
passport.use("local.signup", new LocalStrategy({ //Metodo para el registro del login
    usernameField: "correo", //El  correo ingresado por el ususario
    passwordField: "contraseña_us",//La constraseña ingresada por el ususario
    passReqToCallback: true //Se ingresa una espera para que el servidor la procese
}, async (req, correo, contraseña_us, done) => { //Cuando se ingrese los campos que se envie 
    const rows = await pool.query('SELECT * FROM tbl_usuario WHERE correo = ?', [correo]);
    if (rows.length) {//filas 
        return done(null, false, req.flash('messageRegistro', 'Correo ya registrado'));//mensaje en pantalla
    } else {//
        const { nombre, apellido, telefono } = req.body;
        const newUser = {//Creando un nuevo usuario y se almacena en la DB
            nombre,
            apellido,
            telefono,
            correo,
            contraseña_us
        };
        newUser.contraseña_us = await helpers.encryptPassword(contraseña_us);//se descifre la contraseña nueva de un nuevo usuario
        const result = await pool.query("INSERT INTO tbl_usuario SET ? ", newUser);//Se guarda la constraseña en la BD 
        newUser.id_usuario = result.insertId;
        return done(null, newUser);//Para que se alamacene en una nueva fila

    }
}));
passport.serializeUser((user, done) => {
    done(null, user.id_usuario);
});

passport.deserializeUser(async (id_usuario, done) => {//Se hace una consulta en la BD si el new user existe
    const rows = await pool.query("SELECT * FROM tbl_usuario Where id_usuario = ?", [id_usuario]);//consulta si la bd si es igual al dato siguiente
    done(null, rows[0]);//Objeto desde la fila 0
});