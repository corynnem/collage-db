const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Router } = require("express");
const { Collage } = require("../models");

const collagecontroller = Router();

collagecontroller.post("/create", async (req, res) => {
  const { title, description, link, photoLink } = req.body;
  try {
    let createCollage = await Collage.create({
      title,
      description,
      link,
      photoLink,
    });
    if (createCollage) {
      res.json({
        message: "collage created",
        collage: createCollage,
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "failed to create collage",
    });
  }
});

collagecontroller.get("/all", async (req, res) => {
  try {
    let allCollages = await Collage.findAll();
    res.json({
      collages: allCollages,
    });
  } catch (e) {
    res.status(500).json({
      message: "failed get collages",
    });
  }
});

collagecontroller.get("/:id", async (req, res) => {
  try {
    let collage = await Collage.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json({
      collage: collage,
    });
  } catch (e) {
    res.status(500).json({
      message: "failed get collages",
    });
  }
});

collagecontroller.put("/:id", async (req, res) => {
  const { title, description, link, photoLink } = req.body;

  try {
    const toUpdate = await Collage.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (toUpdate && title) {
      toUpdate.title = title;
      toUpdate.description = description;
      toUpdate.link = link;
      toUpdate.photoLink = photoLink;

      await toUpdate.save();

      res.status(200).json({
        message: "updated collage info successfully",
      });
    } else {
      res.status(404).json({
        message:
          "required fields missing, collage not found, or employer is unauthorized to edit",
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "failed to edit collage info",
    });
  }
});

collagecontroller.delete("/:id", async (req, res) => {
  try {
    const collageToRemove = await Collage.findOne({
      where: {
        id: req.params.id,
      },
    });
    collageToRemove
      ? collageToRemove.destroy()
      : res.status(404).json({
          message: "collage not found, or does not belong to user",
        });
    res.status(200).json({
      message: "removed collage successfully",
    });
  } catch (e) {
    res.status(500).json({
      message: "failed to remove collage",
    });
  }
});

module.exports = collagecontroller;
