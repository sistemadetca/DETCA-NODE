const bcrypt = require("bcryptjs");//PARA DESCIFRAR CONSTRASEÑAS 
const helpers = {};//OBJETO

helpers.encryptPassword = async (password) => {//CONTRASEÑA EN TEXTO PLANO
    const salt = await bcrypt.genSalt(10);//SE DESCIFRARA 10 VECES para mayor seguridad
    const hash = await bcrypt.hash(password, salt);//Se le esta enviando la constraseña para que ya sea dscifrada correctamente
    return hash;
};

helpers.matchPassword = async (password, savedPassword) => { //COMPARA LA CONTRASEÑA CUANDO SE LOGGUEE CON LA DE LA BASE DATOS
    try {
        return await bcrypt.compare(password, savedPassword);//COMPARADAS
    } catch (e) {
        console.log(e);//SI HAY ALGUN ERROR SE IMPRIME
    }
};

module.exports = helpers;