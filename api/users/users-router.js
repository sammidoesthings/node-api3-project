const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const {
  logger,
  errorHandle,
  validateUserId,
  validateUser,
  validatePost
} = require('../middleware/middleware');

const USERS = require('./users-model');
const POSTS = require('../posts/posts-model');

const router = express.Router();

router.use(logger);

//ENDPOINTS

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  USERS.get(req.query)
  .then(users => {
    console.log(users);
    res.status(200).json(users);
  })
  .catch(err => {
    next(err);
  });
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  USERS.insert(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      next(err);
    })
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  USERS.update(req.params.id, req.body) 
  .then(user => {
    res.json(user)
  })
  .catch (err => {
    next(err);
  })
});

router.delete('/:id', validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  USERS.remove(req.params.id)
    .then(user => {
      res.json(req.user)
    })
    .catch(err => {
      next(err);
    })
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  USERS.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      next(err);
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const postContent = {...req.body, user_id: req.params.id}

  POSTS.insert(postContent)
    .then(post => {
      res.status(201).json(post)
    })
    .catch(err => {
      next(err)
    })
});

router.use(errorHandle)

// do not forget to export the router
module.exports = router;