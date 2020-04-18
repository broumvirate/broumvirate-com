const mongoose = require("mongoose")

let nickSchema = new mongoose.Schema({
    date:Date,
    editedBy:String,
    notes:String,
    nicknames:[{
        nickname:String,
        boy:{type: mongoose.Schema.Types.ObjectId, ref: "boy"}
    }]

})

module.exports = mongoose.model("nick", nickSchema)