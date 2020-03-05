var express = require("express")
var router = express.Router();

const   Boy = require("../models/boy"),
        User = require("../models/user");


// ADMIN INDEX
router.get("/admin", isAdmin, function(req, res){
    Boy.find({}, function(err, Boys){
        if(err){
            console.log(err);
        }
        else{
            User.find({}, function(err, Users){
                if(err){
                    console.log(err);
                }
                else{
                    res.render("admin/admin", {pageName:"Admin Panel", Boys:Boys, Users:Users})
                }
            })
        }
    })
})



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
        
function isAdmin(req, res, next){
    if (req.isAuthenticated()){
        if (req.user.isAdmin){
            return next();
        }
        else{
            res.redirect("/bhotm");
        }
    }
    res.redirect("/login")
}

module.exports = router;