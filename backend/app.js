import express from "express";
import cors from "cors";
import Category from "./controllers/Category.js";

const server = express();

const localOrigin = "http://localhost:8080";

const whitelist = [localOrigin];

const corsOptionsDelegate = function (req, callback) {
  const corsOptions = {
    origin: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
  };

  if (!whitelist.includes(req.header("Origin"))) {
    corsOptions.origin = false; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

import "./databases/mongo.js";

server.use(cors(corsOptionsDelegate));

server.use("/", Category);

export default server;
