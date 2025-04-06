import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    boy: { type: mongoose.Schema.Types.ObjectId, ref: "Boy" },
    fname: String,
    isAdmin: Boolean,
});

userSchema.plugin(passportLocalMongoose, {
    populateFields: "boy",
});

export default mongoose.model("User", userSchema);
