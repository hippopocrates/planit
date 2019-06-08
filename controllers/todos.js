
const express = require("express");
const router = express.Router();
// const Plan = require('../models/planModel.js')
const Todo = require("../models/todoModel.js");

router.get("/", (req, res) => {
  Todo.find({}, (err, foundTodo) => {
    res.json(foundTodo);
  });
});

router.delete("/:id", (req, res) => {
  Todo.findByIdAndRemove(req.params.id, (err, deletedTodo) => {
    res.json(deletedTodo);
  });
});

router.post("/", (req, res) => {
  Todo.create(req.body, (err, createdTodo) => {
    res.json(createdTodo);
  });
});

router.put("/:id", (req, res) => {
  Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedTodo) => {
      res.json(updatedTodo);
    }
  );
});

module.exports = router;
