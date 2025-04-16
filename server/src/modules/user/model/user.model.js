import mongoose from "mongoose";
import { ROLES } from "../../../constants/role.contant.js";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
    },
    email: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gim,
    },
    password: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    role: {
      type: mongoose.SchemaTypes.String,
      enum: [ROLES.ADMIN, ROLES.USER],
      default: ROLES.USER,
    },

    phoneNumber: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
      minLength: 9,
      maxLength: 9,
      match:
        /^(9[012345789]|6[125679]|7[0123456789]|3[3]|8[8]|2[0]|5[05])[0-9]{7}$/,
    },
  },
  {
    collection: "users",
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("User", UserSchema);
