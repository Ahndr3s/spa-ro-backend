const { response } = require("express");
const  bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "Someone used that email already!!!",
      });
    }

    user = new User(req.body);

    // ENCRYPTING PASSWORD
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    await user.save();

    // GENERATE JWT
    const token = await generateJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uuid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please talk with the Admin",
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Email or password incorrect!!!",
      });
    }

    // CONFIRM PASSWORD
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Email or password incorrect!!!",
      });
    }

    // GENBERATE JWT
    const token = await generateJWT(user.id, user.name);

    res.json({
      ok: true,
      uuid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please talk to the Admin",
    });
  }
};

const renewToken = async (req, res = response) => {
  const { uuid, name } = req.body;

  // GENERATE TOKEN
  const token = await generateJWT(uuid, name);

  res.json({
    ok: true,
    uuid,
    name,
    token,
  });
};

module.exports = {createUser, loginUser, renewToken}