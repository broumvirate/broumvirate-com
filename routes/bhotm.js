var express = require("express")
var router = express.Router();
var bmHelpers = require("../bmHelpers")

const   Boy = require("../models/boy"),
        User = require("../models/user"),
        bhotmDB = require("../models/bhotm")


// INDEX - BHoTM Standard Viewing Page
router.get("/bhotm", function(req, res){
    bhotmDB.find({}).sort({"date":-1, "entries.place":1}).populate("entries.boy").exec(function(err, bhotm){
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
    var thisMonth = processMonth(req.body.bhotm)
    var d = new Date()
    thisMonth.date = d.getTime();

    bhotmDB.create(thisMonth, function(err, newMonth){ //Add new month to database
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
    bhotmDB.findById(req.params.id).populate("entries.boy").exec(function(err, bhotmold){
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

    var thisMonth = processMonth(req.body.bhotm)
    
    bhotmDB.findByIdAndUpdate(req.params.id, thisMonth, function(err, updateMonth){ //Update month in database
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
    bhotmDB.deleteOne({"_id" : req.params.id}, function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect("/bhotm/admin");	
        }

    })
})



///////////////
// FUNCTIONS
///////////////

function processMonth(month){
    for(i=0; i<month.entries.length; i++){

        //If no linked boy, replace the "" with undefined
        if (month.entries[i].boy == ""){
            month.entries[i].boy = undefined;
        }

        ////////////////////
        // Determine format
        ////////////////////
        const extensions = ["JPG", "jpg", "JPEG", "jpeg", "PNG", "png", "gif", "GIF"];
        let splitLink = month.entries[i].link.split(".");

        if (month.entries[i].link == ""){ //No link means ur mason
            month.entries[i].format = "mason";
        }
        else if(month.entries[i].link.includes("youtube.com")){ //If the link is youtube, convert it to an embed format
            month.entries[i].format = "youtube";
            let link = month.entries[i].link;
            month.entries[i].link = link.replace("watch?v=", "embed/");
        }
        else if(extensions.includes(splitLink[splitLink.length-1])){ // If the last element of the link (. delimited) is in the extension list
            month.entries[i].format = "image";
        }
        else{ //Otherwise it's just a normal link
            month.entries[i].format = "link";
        }
    }

    month.entries.sort((a, b) => (parseInt(a.place) > parseInt(b.place)) ? 1 : -1); //Sort entries by place

    month.entries[0].isWinner = true; //Set winner flags
    month.winner = month.entries[0].name;

    return month;
}

module.exports = router;