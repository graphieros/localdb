import mongoose from "mongoose";

const ItemsSchema = mongoose.Schema({
  id: Number,
  description: String,
  title: String,
});

const categorySchema = mongoose.Schema({
  name: String,
  items: [ItemsSchema],
});

export default mongoose.model("Category", categorySchema);
