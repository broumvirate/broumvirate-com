import mongoose from "mongoose"

let nickSchema = new mongoose.Schema({
    date:Date,
    dateString:String,
    editedBy:String,
    notes:String,
    nicknames:[{
        nickname:String,
        boy:{type: mongoose.Schema.Types.ObjectId, ref: "Boy"}
    }]

})

export default mongoose.model("Nick", nickSchema)