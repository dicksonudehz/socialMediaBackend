import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 50,
    }, 
    password: {
      type: String,
      require: true,
      min: 3,
    },
    confirmPassword: {
      type: String,
      require: true,
      min: 3,
    },
    email: {
      type: String,
      require: true,
      min: 3,
      max: 50,
      unique: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      require: true,
      min: 3,
      max: 50,
    },
    coverPicture: {
      type: String,
      require: true,
      min: 3,
      max: 50,
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
