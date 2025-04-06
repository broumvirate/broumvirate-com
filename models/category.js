import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: String,
    category: String,
    tokens: String
});

export default mongoose.model("Category", categorySchema);