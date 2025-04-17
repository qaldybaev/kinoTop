import mongoose from "mongoose";

const SaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Film",
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "saves",
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model("Save", SaveSchema);
