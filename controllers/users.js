const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');

router.delete('/', (req, res)=>{
  req.session.destroy(() => {
    res.status(200).json({
      status: 200,
      message: 'logout complete'
    });
  })
});

router.post('/', (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  User.create(req.body, (err, createdUser) => {
    res.status(201).json({
      status: 201,
      message: "user created"
    });
  });
});

router.get('/', (req, res) => {
  if (req.session.currentUser) {
    res.json(req.session.currentUser);
  } else {
    res.status(401).json({
      status: 401,
      message: 'not logged in'
    });
  }
});

module.exports = router;
