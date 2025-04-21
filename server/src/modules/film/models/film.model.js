import mongoose from "mongoose";

const FilmShema = new mongoose.Schema(
  {
    title: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
    },
    description: {
      type: mongoose.SchemaTypes.String,
      required: false,
    },
    year: {
      type: mongoose.SchemaTypes.Number,
      required: true,
    },
    imageUrl: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    videoUrl: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
    },
    review: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    collection: "films",
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Film", FilmShema);
