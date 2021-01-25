const express = require('express');
const conversion = express.Router();
const axios = require('axios').default;
var bodyParser =require('body-parser');

var jsonParser = bodyParser.json()

const wrap = fn => (...args) => fn(...args).catch(args[2])



export default conversion;
