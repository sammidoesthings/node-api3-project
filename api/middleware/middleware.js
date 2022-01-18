const USERS = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log('I am not broken!');
  console.log(`${req.method} ${req.path}`);
  next();
}

function errorHandle(err, req, res) {
  res.status(err.status || 500).json({ message: `I am broken now! Fix me: ${err.message}`})
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try { 
    const user = await USERS.getById(req.params.id);
    if (user) {
      req.user = user;
      next();
    } else {
      next({ status:404, message: "user not found" })
    }
  } catch (error) {
    next(error)
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if (!req.body.name) {
    next({ status:400, message:"missing required name field" })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if (!req.body.text) {
    next({ status:400, message: "missing required text field" })
  } else {
    next();
  }
}

// do not forget to expose these functions to other modules

module.exports = {
  logger,
  errorHandle,
  validateUserId,
  validateUser,
  validatePost
}