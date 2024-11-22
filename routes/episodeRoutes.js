const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userSchema");
const Project = require("../models/projectSchema");
const Episode = require("../models/episodeSchema");
const router = express.Router();

router.post(
  "/create-episode/:projectId",
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

      const { episodeName, status, transcript } = request.body;

      if (!episodeName || !status || !transcript) {
        response.status(400).send({
          success: false,
          message: "Fields required!!",
          data: {},
        });
        return;
      }

      const newEpisode = new Episode({
        name: episodeName,
        status: status,
        projectId: projectId,
        transcript: transcript,
      });

      await newEpisode.save();

      const episodes = await Episode.find({ projectId: projectId });

      response.status(201).send({
        success: true,
        message: "Episode created",
        data: episodes,
      });
      return;
    } catch (error) {
      console.log(error.message);
      response.status(500).send({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

router.get(
  "/all-episodes/:projectId",
  authMiddleware,
  async (request, response) => {
    try {
      const projectId = request.params.projectId;

      const episodes = await Episode.find({ projectId: projectId });

      response.status(200).send({
        success: true,
        message: "Episodes found",
        data: episodes,
      });
      return;
    } catch (error) {
      response.status(500).send({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

router.put(
  "/edit-episode/:episodeId",
  authMiddleware,
  async (request, response) => {
    try {
      const episodeId = request.params.episodeId;

      if (!episodeId) {
        response.status(400).send({
          success: false,
          message: "episodeId required",
          data: {},
        });
        return;
      }
      const episode = await Episode.findById({ _id: episodeId });

      const { transcript, status } = request.body;

      const validStatuses = ["inprogress", "done"];

      if (status && !validStatuses.includes(status)) {
        return response.status(400).send({
          success: false,
          message: "Invalid status value",
          data: {},
        });
      }
      episode.transcript = transcript;
      episode.status = status;

      await episode.save();

      response.status(200).send({
        success: true,
        message: "Episode editted",
        data: episode,
      });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

router.delete(
  "/delete-episode/:episodeId",
  authMiddleware,
  async (request, response) => {
    try {
      const episodeId = request.params.episodeId;
      const projectId = request.query.pid;

      await Episode.deleteOne({ _id: episodeId });

      await Project.findOneAndUpdate(
        { _id: projectId },
        { $inc: { episodeCount: -1 } }
      );

      response.status(200).send({
        success: true,
        message: "Episode deleted",
        data: {},
      });
      return;
    } catch (error) {
      console.log(error.message);
      response.status(500).send({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

module.exports = router;
