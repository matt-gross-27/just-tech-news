const router = require('express').Router();
const { User, Post, Vote } = require('../../models')

// GET /api/users - all users
router.get('/', (req, res) => {
  // Access our User model and run .findAll() method
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET /api/users/id - one user
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: { id: req.params.id },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at']
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts'
      }
    ]
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
  // expects req.body: { "username": "un", "email": "email@aol.com", "password": "secret" }
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT /api/users/id
router.put('/:id', (req, res) => {
  // expects req.body: { "username": "un", "email": "email@aol.com", "password": "secret" }
  
  // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
  User.update(req.body, {
    individualHooks: true,
    where: { id: req.params.id }
  })
    .then(dbUserData => {
      if(!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Login route
router.post('/login', (req, res) => {
  // expects { email:'blah@blah.com', password: 'secret' }
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if(!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }
    // verify user
    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return
    }
    res.json({ user: dbUserData, message: 'You are now logged in!' });
  });
});

// DELETE /api/users/id
router.delete('/:id', (req, res) => {
  User.destroy({
    where: { id: req.params.id }
  })
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

module.exports = router