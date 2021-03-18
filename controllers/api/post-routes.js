const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// GET /api/posts/ - get all posts
router.get('/', (req, res) => {
  Post.findAll({
    order: [['created_at', 'DESC']],
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        order: [['id', 'DESC']],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ],
    order: [['id', 'DESC']]
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET /api/posts/:id - get post by id
router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  })
    .then(dbPostData => {
      if(!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST api/posts create a new post
router.post('/', withAuth, (req, res) => {
  // expects req.body == { "title": "postTile", "post_url": "http://www..." }
    // and req.session.user_id = { "user_id: 1" }
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.session.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT /api/posts/upvote - upvote a post
router.put('/upvote', withAuth, (req, res) => {
  // make sure session exists to get user
  if (req.session) {
    //pass session id along with all destructured properties on req.body
    // custom static method created in models/Post.js
    Post.upvote({
      // expects { "post_id": INT, "user_id": INT }
      // req.body == { "post_id": INT }
      ...req.body, 
      user_id: req.session.user_id 
    }, 
    { Vote, Comment, User })
      .then(updatedVoteData => res.json(updatedVoteData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

// PUT /api/posts/:id - update a post title by id
router.put('/:id', withAuth, (req, res) => {
  Post.update(
    { 
      title: req.body.title
    },
    { 
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if(!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, (req, res) => {
  Comment.destroy({
    where: {
      post_id: req.params.id
    }
  })
    .then(
      Post.destroy({
        where: {
          id: req.params.id
        }
      })
        .then(dbPostData => {
          if(!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
          }
          res.json(dbPostData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        }))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;