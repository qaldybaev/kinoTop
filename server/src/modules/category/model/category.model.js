import mongoose from "mongoose";

const CategoryShema = new mongoose.Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
    },

    film: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Film",
      },
    ],
  },
  {
    collection: "categorys",
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Category",CategoryShema)
