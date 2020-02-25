var express = require("express")
var router = express.Router();

const   Boy = require("../models/boy"),
        User = require("../models/user"),
        bhotmDB = require("../models/bhotm")


// INDEX - BHoTM Standard Viewing Page
router.get("/bhotm", function(req, res){
    bhotmDB.find({}).sort('-date').populate("entries.boy").exec(function(err, bhotm){
        if (err){
            console.log(err);
        }
        else{
            res.render("bhotm/index", {pageName:"Ben Hagle of the Month", bhotm:bhotm})
        }

    })
})

// ADMIN INDEX - Admin page, available only to admins like Ben Hagle
router.get("/bhotm/admin", isAdmin, function(req, res){
    bhotmDB.find({}).sort('-date').populate("entries.boy").exec(function(err, bhotm){
        if (err){
            console.log(err);
        }
        else{
            res.render("bhotm/admin", {pageName:"BHotM Admin", bhotm:bhotm})
        }
    })
})

// NEW
router.get("/bhotm/new", isAdmin, function(req,res){
    Boy.find({}, function(err, boys){
        if(err){
            console.log(err);
        }
        else{
            res.render("bhotm/new", {pageName:"New BHotM", entries:req.query.entries, boys:boys})
        }
    })
})

// CREATE
router.post("/bhotm", isAdmin, function(req,res){
    var thisMonth = req.body.bhotm
    var d = new Date()
    thisMonth.date = d.getTime();
    for(i=0; i<thisMonth.entries.length; i++){ //Loop through entries, processing one by one

        if (thisMonth.entries[i].place == 1){ //If winner, set appropriate winner flags
            thisMonth.entries[i].isWinner = true;
            thisMonth.winner = thisMonth.entries[i].name;
        }
        if (thisMonth.entries[i].boy == ""){ //If no linked boy, replace the "" with undefined
            thisMonth.entries[i].boy = undefined;
        }
        if (thisMonth.entries[i].format === "youtube"){ //If it's a youtube link, convert it to an embed
            let link = thisMonth.entries[i].link;
            thisMonth.entries[i].link = link.replace("watch?v=", "embed/");
        }
    }

    bhotmDB.create(thisMonth, function(err, newMonth){ //Add new month to database
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/bhotm/admin");
        }
    })
})

router.get("/bhotm/:id", function(req,res){
    res.redirect("/bhotm");
})

// EDIT  TODO
router.get("/bhotm/:id/edit", isAdmin, function(req,res){
    // bhotmDB.findById(req.params.id).populate("entries.boy").exec(function(err, bhotm){
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         Boy.find({}, function(err, boys){
    //             res.render("bhotm/edit", {pageName:"Edit BHotM", bhotm:bhotmold, boys:boys})
    //         })
    //     }
    // })
    res.redirect("/bhotm/admin");
})

// PUT
router.put("/bhotm/:id", isAdmin, function(req,res){
    var thisMonth = req.body.bhotm
    for(i=0; i<thisMonth.entries.length; i++){ //Loop through entries, processing one by one

        if (thisMonth.entries[i].place == 1){ //If winner, set appropriate winner flags
            thisMonth.entries[i].isWinner = true;
            thisMonth.winner = thisMonth.entries[i].name;
        }
        if (thisMonth.entries[i].boy == ""){ //If no linked boy, replace the "" with undefined
            thisMonth.entries[i].boy = undefined;
        }
        if (thisMonth.entries[i].format === "youtube"){ //If it's a youtube link, convert it to an embed
            let link = thisMonth.entries[i].link;
            thisMonth.entries[i].link = link.replace("watch?v=", "embed/");
        }
    }

    bhotmDB.findByIdAndUpdate(req.param.id, thisMonth, function(err, newMonth){ //Update month in database
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/bhotm/admin");
        }
    })
})

// DELETE - Deletes specified BHoTM
router.delete("/bhotm/:id", isAdmin, function(req, res){
    bhotmDB.deleteOne({"_id" : req.params.id}, function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect("/bhotm/admin");	
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