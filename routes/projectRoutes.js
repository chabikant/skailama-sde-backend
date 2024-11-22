const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userSchema");
const Project = require("../models/projectSchema");
const Episode = require("../models/episodeSchema");
const router = express.Router();

router.post("/create-project", authMiddleware, async (request, response) => {
  try {
    const projectName = request.body.projectName;

    if (!projectName) {
      response.status(400).send({
        success: false,
        message: "projectId required!!",
        data: {},
      });
      return;
    }
    const newProject = new Project({
      name: request.body.projectName,
      userId: request.body.userId,
    });

    await newProject.save();

    const projectsData = await Project.find({ userId: request.body.userId });
    
    response.status(201).send({
      success: true,
      message: "projects created!!",
      data: projectsData,
    });
  } catch (error) {
    response.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/all-projects", authMiddleware, async (request, response) => {
  try {
    const projectsData = await Project.find({ userId: request.body.userId });

    if (!projectsData) {
      response.status(404).send({
        success: false,
        message: "No projects found!!",
        data: [],
      });
      return;
    }

    response.status(200).send({
      success: true,
      message: "projects found!!",
      data: projectsData,
    });
  } catch (error) {
    response.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get(
  "/project-detail/:projectId",
  authMiddleware,
  async (request, response) => {
    try {
      const projectId = request.params.projectId;

      if (!projectId) {
        response.status(400).send({
          success: false,
          message: "Project id required",
          data: {},
        });
        return;
      }
      const project = await Project.findById({ _id: projectId });

      if (!project) {
        response.status(404).send({
          success: false,
          message: "No project found!!",
          data: {},
        });
        return;
      }

      // const episodes = await Episode.find({ projectId: projectId });

      response.status(200).send({
        success: true,
        message: "Episodes found!!",
        data: project,
      });
    } catch (error) {
      response.status(500).send({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

router.delete(
  "/delete-project/:projectId",
  authMiddleware,
  async (request, response) => {
    try {
      const projectId = request.params.projectId;
      await Project.deleteOne({ _id: projectId });

      response.status(200).send({
        success: true,
        message: "Deleted successfully",
        data: {},
      });
    } catch (error) {
      response.status(500).send({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);
module.exports = router;
