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
    return res.status(422).json({ errors: ["Photo could not be created"] });
  }

  res.status(201).json(newPhoto);
};

// Remove a photo
const deletePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    // Check if the photo exists
    if (!photo) {
      return res.status(404).json({ errors: ["Photo not found"] });
    }

    // Check if the user is the owner of the photo
    if (!photo.userId.equals(reqUser._id)) {
      return res.status(422).json({ errors: ["Try again later"] });
    }

    await Photo.findByIdAndDelete(photo._id);

    res.status(200).json({ id: photo._id, message: "Photo deleted" });
  } catch (error) {
    res.status(404).json({ id: photo._id, message: "Photo not found" });
  }
};

// Get all photos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({}).sort({ createdAt: -1 }).exec();

  return res.status(200).json(photos);
};

//Get all photos of a user
const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id })
    .sort({ createdAt: -1 })
    .exec();

  return res.status(200).json(photos);
};

//Get photo by id
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

  // Check if the photo exists
  if (!photo) {
    return res.status(404).json({ errors: ["Photo not found"] });
  }

  res.status(200).json(photo);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
};
