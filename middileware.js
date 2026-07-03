const jwt = require("jsonwebtoken");
function authMiddleware (req,res,next){
 const token = req.headers.token ;
 const decode = jwt.verify(token , "anil123");
 if(decode.userId){
     req.userId = decode.userId;
     next();

 }else{
    res.status(403).json({
        message :"token invalid or not found "
    })
 }

}
 module.exports = {
    authMiddleware : authMiddleware 
 }