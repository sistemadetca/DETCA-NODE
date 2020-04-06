const mysql = require("mysql");//conectando con mysql
const { promisify } = require("util"); //Libreria de promesas de node

const { database } = require("./keys");

const pool = mysql.createPool(database); //Hace que trabaje por secuencia o hilos

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") { //Si muestra este error
            console.error("DATABASE CONNECTION WAS CLOSED");// se va imprimir 
        }
        if (err.code === "ER_CON_COUNT_ERROR") {//Si muestra este error
            console.error("DATABASE HAS TO MANY CONNECTION");// se va imprimir 
        }
        if (err.code === "ECONNREFUSED") { //Si muestra este error
            console.error("DATABASE CONNECTION WAS REFUSED");// se va imprimir 
        }
    }

    if (connection) connection.release();//Si no hay errores , que se conecte a la BD
    console.log("DB is Connected"); //SE VA IMPRIMIR
    return; 
});

pool.query = promisify(pool.query);//Pueda usar async wait o promesas, y accediendo a consultas

module.exports = pool; //Exportamos el modulo pool creado en keys