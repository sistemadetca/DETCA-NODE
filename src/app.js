const express = require('express'); //MODULOS HTPP
const morgan = require("morgan"); //Modulo para mensajes especificos
const exphbs = require("express-handlebars");//Plantilla de vistas
const socketIo = require("socket.io");//Llamando desde la biblioteca websockets
const http = require("http");//modulos de http
const flash = require("connect-flash");//Modulos para losmensajes
const session = require("express-session");//Se guarde las sessiones en el server
const MySQLStore = require("express-mysql-session")//(session);
const passport = require("passport"); //Modulo para autenticar ususarios
const { database } = require("./keys"); // Conexion a la base datos mysql
const bodyParser = require('body-parser');

const app = express(); //OBJETO, QUE ES NUESTRO SERVIDOR

const server = http.createServer(app); //Se llaman los modulos del servidor requerido
const io = socketIo.listen(server);//Usamos el objeto websockets para que se inicie en el server 
const engine = require('ejs-mate');
const path = require('path');

//Inicializaciones
require("./lib/passport"); //Server se entere donde esta la inicializacion de passport

//Websockets actualizando
io.on("connection", function (socket) {
    console.log(" new socket connected");//imprime en consola cuando se actualize
});


//ARDUINO SERIAL PORT
const SerialPort = require("serialport");//libreria del serial port
const ReadLine = SerialPort.parsers.Readline;
const parser = new ReadLine();

const mySerial = new SerialPort("COM3", { //puerto del arduino
    baudRate: 9600
})

//Eventos del arduino
mySerial.on("open", function () { //conexion este abierta
    console.log("opened serial port");
});

mySerial.on("data", function (data) {
    //console.log(data.toString()); //Reciviendo datos del arduino
    io.emit("arduino:data", { //websockets enviar datos
        value: data.toString()//extension json de los datos emitidos de websockets
    });
});
mySerial.on("err", function (err) {
    console.log(err.message); //Obtener mensaje cuando se obtenga un error
});

//CONFIGURACIONES
app.set('views', path.join(__dirname, 'views'));//RUTA VISTAS OS PRINCIPAL
app.engine('ejs', engine);
app.set('view engine', 'ejs');//MOTOR DE PLANTILLAS
app.engine('.hbs', exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars")
}));
 
// app.set('port', process.env.PORT || 2000); //PUERTO DEL SERVIDOR 

//Midlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //Recivir datos de tipo string

app.use(session({
    secret: 'autosecretdetcalol',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));

app.use(flash());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req, res, next) => { // Mensajes para el ussario en el login 
    app.locals.success = req.flash("success"); //Correcto login
    app.locals.message = req.flash("message"); //Contraseña incorrecta
    app.locals.alert = req.flash("alert"); //Correro no exite
    app.locals.user = req.user;
    //console.log(app.locals);
    next();
});

//public
app.use(express.static(path.join(__dirname, 'public')));//DONDE CARGAR ARCHIVOS ESTATICOS EJM: CSS, JS, IMG

//routes
app.use(require('./routes/index'));//vista principal
app.use(require('./routes/authentication'));//Vistas de login etc...
app.use(require('./views/chart'));//Grafica arduino 



//Archivos estaticos, css, js,img
app.use(express.static(path.join(__dirname, 'public', 'CSS')));
app.get("/", (req, res, next) => {
    res.sendFile(__dirname + "chart.ejs");//los datos del arduino 
});

// app.listen(app.get('port'), () => {
//     console.log('Servidor en puerto ', app.get('port')); //RECIVE LAS PETICIONES DEL SERVIDOR
// });
//app Listening server
server.listen(2000, () => {
    console.log("Conexion en el puerto", 2000);//server ejecutando.

});


