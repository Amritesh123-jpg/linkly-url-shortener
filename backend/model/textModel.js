const mongoose = require("mongoose");

const textSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Text content is required"],
      trim: true,
    },

    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
    
  },
  {
    timestamps: true,
  }
);

const Text = mongoose.model("Text", textSchema);

module.exports = Text;