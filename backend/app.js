const express = require('express');
require('./models/index')
const router = require('./routes/index')

const path = require('path');

const app = express();

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api', router)

module.exports = app;