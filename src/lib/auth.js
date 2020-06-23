module.exports = {
    
    isloggedIn(req, res, next) {
        if (req.isAuthenticated()) { //Metodo para saber si el usuario esta logeado
            return next(); //Continue
        }//sino
        return res.redirect("/signin");//Me redireciona a la vista de inicio de sesion            
    }

//     isNotLoggedin(req,res,next) {//Efecto inverso cuando el usuario este logeado
//         if (!req.isAuthenticated()) {
//             return next();
//         }
//         return res.redirect("/profile");
//     }
    //
};
