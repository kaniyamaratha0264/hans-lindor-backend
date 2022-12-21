const express = require('express')
const measureDistance = require('../Controller/distanceController')

const route = express.Router()

route.post("/getDistance", measureDistance)

module.exports = route