const bcrypt = require("bcryptjs");//PARA DESCIFRAR CONSTRASEÑAS 
const helpers = {};//OBJETO

helpers.encryptPassword = async (contraseña_us) => {//CONTRASEÑA EN TEXTO PLANO
    const salt = await bcrypt.genSalt(10);//SE DESCIFRARA 10 VECES para mayor seguridad
    const hash = await bcrypt.hash(contraseña_us, salt);//Se le esta enviando la constraseña para que ya sea dscifrada correctamente
    return hash;
};
helpers.matchPassword = async (contraseña_us, savedPassword) => { //COMPARA LA CONTRASEÑA CUANDO SE LOGGUEE CON LA DE LA BASE DATOS
    try {
        return await bcrypt.compare(contraseña_us, savedPassword);//COMPARADAS
    } catch (e) {
        console.log(e);//SI HAY ALGUN ERROR SE IMPRIME
    }
};
module.exports = helpers;