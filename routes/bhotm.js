var express = require("express")
var router = express.Router();
var bmHelpers = require("../bmHelpers")

const   Boy = require("../models/boy"),
        User = require("../models/user"),
        {bhotm} = require("../models/bhotm"),
        {bhotmEntry} = require("../models/bhotm")


// INDEX - BHoTM Standard Viewing Page
router.get("/bhotm", function(req, res){
    bhotm.find({}).sort({"date":-1, "entries.place":1}).populate("entries.boy").exec(function(err, bhotm){
        if (err){
            console.log(err);
        }
        else{
            res.render("bhotm/index", {pageName:"Ben Hagle of the Month", bhotm:bhotm})
        }

    })
})

// ADMIN INDEX - Admin page, available only to admins like Ben Hagle
router.get("/bhotm/admin", bmHelpers.isAdmin, function(req, res){
    bhotm.find({}).sort('-date').populate("entries.boy").exec(function(err, bhotm){
        if (err){
            console.log(err);
        }
        else{
            res.render("bhotm/admin", {pageName:"BHotM Admin", bhotm:bhotm})
        }
    })
})

// NEW
router.get("/bhotm/new", bmHelpers.isAdmin, function(req,res){
    Boy.find({}, function(err, boys){
        if(err){
            console.log(err);
        }
        else{
            res.render("bhotm/new", {pageName:"New BHotM", entries:req.query.entries, boys:boys})
        }
    })
})

// CREATE -- Add new BHotM from creation page
router.post("/bhotm", bmHelpers.isAdmin, function(req,res){
    var thisMonth = bmHelpers.bhotm.processMonth(req.body.bhotm)
    var d = new Date()
    thisMonth.date = d.getTime();

    bhotm.create(thisMonth, function(err, newMonth){ //Add new month to database
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/bhotm/admin");
        }
    })
})

// Trying to get a specific month by ID redirects you back to main BHotM page
// TODO - make specific month page? maybe with more info?
router.get("/bhotm/:id", function(req,res){
    res.redirect("/bhotm");
})

// EDIT - Edit existing bhotm
router.get("/bhotm/:id/edit", bmHelpers.isAdmin, function(req,res){
    bhotm.findById(req.params.id).populate("entries.boy").exec(function(err, bhotmold){
        if(err){
            console.log(err);
        }
        else{
            Boy.find({}, function(err, boys){
                res.render("bhotm/edit", {pageName:"Edit BHotM", bhotmold:bhotmold, boys:boys})
            })
        }
    })
})

// PUT - Updates a month after an edit
router.put("/bhotm/:id", bmHelpers.isAdmin, function(req,res){

    var thisMonth = bmHelpers.bhotm.processMonth(req.body.bhotm)
    
    bhotm.findByIdAndUpdate(req.params.id, thisMonth, function(err, updateMonth){ //Update month in database
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/bhotm/admin");
        }
    })
})

// DELETE - Deletes specified BHoTM
router.delete("/bhotm/:id", bmHelpers.isAdmin, function(req, res){
    bhotm.deleteOne({"_id" : req.params.id}, function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect("/bhotm/admin");	
        }

    })
})

module.exports = router;