const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true
  },
  dueDate: Date,
  notes: String
})

const Todos = mongoose.model('Todo', TodoSchema )

module.exports = Todos
