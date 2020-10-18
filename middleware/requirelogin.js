const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../key")
const mongoose = require('mongoose')
const User = mongoose.model("User")

function requireLogin(req, res, next) {

    let user;
//module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "you  must be logged in" })
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "you  must be logged in" })
        }
        const { _id } = payload
        User.findById(_id).then(userdata => {
            req.body.user = userdata
           user= userdata;
            //req.body.userId=payload._id
            //console.log(req.body.userId);
            console.log(userdata);
       
        })
       req.body.userId=payload._id
          //  console.log("dfhgfhgh  "+user);
       
        next();
   
         })
         
}
module.exports = requireLogin;
