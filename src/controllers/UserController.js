const config = require("../../config/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function authenticate({ username, password }) {
  const user = await User.findOne({ username });
  if (user && bcrypt.compareSync(password, user.password)) {
    const { hash, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user.id }, config.secret);
    return {
      ...userWithoutHash,
      token
    };
  }
}

async function getAll() {
  return await User.find().select("-hash");
}

async function getById(id) {
  return await User.findById(id).select("-hash");
}

async function create(userParam) {
  // validate
  if (
    await User.findOne({ username: userParam.username, email: userParam.email })
  ) {
    throw "Username: " +
      userParam.username +
      " and email: " +
      userParam.email +
      " is already taken";
  }
  if (await User.findOne({ username: userParam.username })) {
    throw "Username: " + userParam.username + " is already taken";
  }
  if (await User.findOne({ email: userParam.email })) {
    throw "Email: " + userParam.email + " is already taken";
  }

  const user = new User(userParam);

  // save user
  await user.save();
}

async function update(id, userParam) {
  const user = await User.findByIdAndUpdate(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.username === userParam.username ||
    (user.email === userParam.email &&
      (await User.findOne({
        username: userParam.username,
        email: userParam.email
      })))
  ) {
    throw "Username: " +
      userParam.username +
      " and email: " +
      userParam.email +
      " is already taken";
  }
  if (
    user.username === userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw "Username " + userParam.username + " is already taken";
  }
  if (
    user.email === userParam.email &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw "Email:  " + userParam.email + "  is already taken";
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}
