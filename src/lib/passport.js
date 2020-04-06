const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy;

const pool = require("../database");//sE LLAMA LA DB
const helpers = require("../lib/helpers"); //Se le indica donde esta la carptea lib y la pueda usar

//Login
passport.use("local.signin", new LocalStrategy({//Metodo para el inicio de sesion
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, async (req, username, password, done) => {
        const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);//Consulta a la BD si el usuario o correo coinciden
    if (rows.length > 0) {//
        const user = rows[0];//SE GUARDE EL USUARIO
        const validPassword = await helpers.matchPassword(password, user.password) //LO GUARDA Y VALIDA LA CONSTRASEÑA
        if (validPassword) {
            done(null, user, req.flash("success", "Bienvenido" + user.username));//Si todo es validado , se ingrese al y le de un mensaje de bienvenida 
        } else {//De lo contrario
            done(null, false, req.flash("message", "contraseña incorrecta"));//Se imprima 
        }
    } else { //si no existe el usuario
        return done(null, false, req.flash("alert", "El correo no existe"));//Mensaje
    }
}));

//Registro
passport.use("local.signup", new LocalStrategy({ //Metodo para el registro del login
    usernameField: "username", //El  correo ingresado por el ususario
    passwordField: "password",//La constraseña ingresada por el ususario
    passReqToCallback: true //Se ingresa una espera para que el servidor la procese
}, async (req, username, password, done) => { //Cuando se ingrese los campos que se envie 
        const { fullname } = req.body;  
        let newUser = {//Creando un nuevo usuario y se almacena en la DB
            fullname,
            username,
            password
            
        };
        newUser.password = await helpers.encryptPassword(password);//se descifre la contraseña nueva de un nuevo usuario
        const result = await pool.query("INSERT INTO users SET ? ",  newUser);//Se guarda la constraseña en la BD 
        newUser.id = result.insertId;
        return done(null, newUser);//Para que se alamacene en una nueva fila
}));



passport.serializeUser((user, done) => {
    done(null, user.id);
     
});
 
passport.deserializeUser(async (id, done) => {//Se hace una consulta en la BD si el new user existe
    const rows = await pool.query("SELECT * FROM users Where id = ?", [id]);//consulta si la bd si es igual al dato siguiente
    done(null, rows[0]);//Objeto desde la fila 0

});