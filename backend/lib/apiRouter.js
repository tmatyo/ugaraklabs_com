const express = require('express')
const app = express()
const api = express.Router()
const { checkForCycles, sendEmail } = require('./smtp2go');

api.use(express.json());

api.use((req, res, next) => {
    const token = "tokkken"
    next()
})

api.post('/checkForCycles', checkForCycles)

api.post('/sendEmail', sendEmail)

module.exports = { app, api }