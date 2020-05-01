var express = require("express")

module.exports={

    discordTags:{
        4172:"5dfa4993ae42c901a49dc6e8",//Ben
        4269:"5dfa4993ae42c901a49dc6ea",//Jacob
        3529:"5dfa4993ae42c901a49dc6e9",//Alden
        4380:"5dfa4993ae42c901a49dc6ec",//Kai
        5591:"5dfa4993ae42c901a49dc6eb",//Emerson
        8067:"5dfa4993ae42c901a49dc6ee",//Miles
    },

    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    },
            
    isAdmin: function(req, res, next){
        if (req.isAuthenticated()){
            if (req.user.boy.isAdmin){
                return next();
            }
            else{
                res.redirect("/bhotm");
            }
        }
        res.redirect("/login")
    }

}