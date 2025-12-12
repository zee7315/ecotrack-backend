const mongoose = require("mongoose");

const projectLogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Planning", "In Progress", "Completed", "On Hold"],
    default: "Planning" 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("ProjectLog", projectLogSchema);
