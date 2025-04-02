const mongoose = require("mongoose")

let nickSchema = new mongoose.Schema({
    date:Date,
    dateString:String,
    editedBy:String,
    notes:String,
    nicknames:[{
        nickname:String,
        boy:{type: mongoose.Schema.Types.ObjectId, ref: "Boy"} // Update if you change Boy model name capitalization
    }]

})

module.exports = mongoose.model("Nick", nickSchema) // Consider capitalizing model name for consistency