const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");

// Insert a photo, with a user related to it
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reUser = req.user;

  const user = await User.findById(reUser._id);

  // Create a photo
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  // If photo is not created
  if (!newPhoto) {
    return res.status(422).json({ errors: "Photo could not be created" });
  }

  res.status(201).json(newPhoto);
};

module.exports = {
  insertPhoto,
};
