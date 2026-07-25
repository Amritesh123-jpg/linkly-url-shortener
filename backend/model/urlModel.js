console.log("✅URL model Loaded");

const mongoose = require('mongoose');
const { trim } = require('validator');

const urlSchema = new mongoose.Schema(
  
  {
    originalUrl: {
      type: String,
      required:[true,"Please provide a URL"],
      trim: true
    },
    
    shortCode:{
      type: String,
      required: [true, "Short code is required"],
      unique: true,
      trim: true
      },

    clicks:{
      type: Number,
      default: 0
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true,"URL must belong to a user"]
    },

    expiresAt: {
      type: Date,
      default: null // Set expiration to 30 days from creation}
    },

    lastClickedAt: {
      type: Date,
      default: null
    },
    clickHistory: [
      {
        clickedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tag:{
      type: String,
      trim: true,
      maxlength: [20, "Tag cannot exceed 20 characters"],
      default: "general"
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
    type: Date,
    default: null,
    },
    title: {
      type: String,
      default: "",
    },

    favicon: {
      type: String,
      default: "",
    }
  

     },
     {
      timestamps: true
     }
);

  //   urlSchema.pre(/^find/, function () {
  //   this.where({ isDeleted: false });
    
  // });

const Url = mongoose.model("Url",urlSchema);
module.exports = Url;