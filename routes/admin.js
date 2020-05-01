var express = require("express");
var router = express.Router();
var bmHelpers = require("../bmHelpers");

const   Boy = require("../models/boy"),
        User = require("../models/user");


// ADMIN INDEX
router.get("/badmin", bmHelpers.isAdmin, function(req, res){
    Boy.find({}, function(err, Boys){
        if(err){
            console.log(err);
        }
        else{
            User.find({}).populate("boy").exec(function(err, Users){
                if(err){
                    console.log(err);
                }
                else{
                    res.render("admin/admin", {pageName:"Boy Admin Panel", Boys:Boys, Users:Users})
                }
            })
        }
    })
})

// BOY New

// BOY Edit

// BOY Put

// BOY Delete

// USER Edit

// USER Put

// USER Delete

module.exports = router;