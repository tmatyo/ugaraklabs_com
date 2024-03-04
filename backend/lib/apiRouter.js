const express = require("express");
const app = express();
const api = express.Router();
const { checkForCycles, sendEmail } = require("./smtp2go");
const cors = require('cors');

api.use(express.json());
api.use(cors({
    origin: ['http://localhost:5173','http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'OPTIONS']
    }));

api.use((req, res, next) => {
  next();
});

api.post("/checkForCycles", checkForCycles);

api.post("/sendEmail", sendEmail);

module.exports = { app, api };
