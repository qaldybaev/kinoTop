
import mongoose from "mongoose";

const ReviewShema = new mongoose.Schema(
  {
    comment: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    rating: {
      type: mongoose.SchemaTypes.Number,
      required: true,
      min: 1,
      max: 5,
    },
    filmId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Film",
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    collection: "reviews",
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Review", ReviewShema);
