const express = require('express');
const router = express.Router();


const bookRoutes = require('./books')
const userRoutes = require('./user')

router.use('/books', bookRoutes);
router.use('/auth', userRoutes);

module.exports = router