const express = require("express");

const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());
require("dotenv").config();

require("./config/dbConfig");

const userRoute = require("./routes/userRoutes");
const projectRoute = require("./routes/projectRoutes");
const episodeRoute = require("./routes/episodeRoutes");

app.use("/user", userRoute);
app.use("/episode", episodeRoute);
app.use("/project", projectRoute);

app.listen("3005", () => {
  console.log("app is listening on 3005");
});
