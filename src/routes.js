const express = require("express");
const router = express.Router();
const userService = require("./controllers/UserController");

// routes
router.post("/authenticate", authenticate);
function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then(user =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch(err => next(err));
}
router.post("/register", register);

function register(req, res, next) {
  const { username, email } = req.body;
  userService
    .create(req.body)
    .then(() => res.json({ username, email }))
    .catch(err => next(err));
}

router.get("/", getAll);
function getAll(req, res, next) {
  userService
    .getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
}
router.get("/current", getCurrent);
function getCurrent(req, res, next) {
  userService
    .getById(req.user.sub)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}
router.get("/:id", getById);
function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}
router.put("/:id", _update);
function _update(req, res, next) {
  const { address, username, email, password } = req.body;
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}
router.delete("/:id", _delete);
function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch(err => next(err));
}

module.exports = router;
