const express = require('express');
const app = express();
const api = express.Router();
const { checkForCycles, sendEmail } = require('./smtp2go');
const cors = require('cors');
const reCaptcha = require('./reCaptcha');

api.use(express.json());
api.use(
	cors({
		origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
		methods: ['GET', 'POST', 'OPTIONS'],
	}),
);

api.use((req, res, next) => {
	if (reCaptcha(req.body.token)) {
		next();
	} else {
		res.status(403).json({ statu: 403, message: 'Forbidden: Bot alert!' });
		return;
	}
});

api.post('/checkForCycles', checkForCycles);

api.post('/sendEmail', sendEmail);

module.exports = { app, api };
