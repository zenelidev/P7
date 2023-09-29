const express = require('express');
const router = express.Router();
const Book = require('../models/Books');
const bookCtrl = require('../controllers/books')
const auth = require('../middleware/auth');


router.post('/', auth, bookCtrl.createBook);
  
router.put('/:id', auth, bookCtrl.modifyBook);

router.delete('/:id', auth,bookCtrl.deleteBook);

router.get(':id', auth,bookCtrl.getOneBook);
  
router.get('/', auth, bookCtrl.findAllBooks);

module.exports = router;