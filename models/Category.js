//category schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      // default:'https://fastly.picsum.photos/id/127/200/300.jpg?hmac=H0aErkmw8FxF1Tp7uFj4cV-aVMxDDjOVKTwGwS6REXw',
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);

export default Category;