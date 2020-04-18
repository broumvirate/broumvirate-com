var express = require("express")
var router = express.Router();
var bmHelpers = require("../bmHelpers")

const   Boy = require("../models/boy"),
        User = require("../models/user");


// ADMIN INDEX
router.get("/admin", bmHelpers.isAdmin, function(req, res){
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

module.exports = router;