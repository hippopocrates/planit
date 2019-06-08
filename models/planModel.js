const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: Date,

  modal: Boolean,
  location: String,
  image: String,
  todos: { type: Array }
});

const Plans = mongoose.model("Plan", PlanSchema);

module.exports = Plans;
