const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const bookCtrl = require("../controllers/books");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require('../middleware/sharp');


router.post("/", auth, multer, sharp, bookCtrl.createBook);

router.put("/:id", auth, multer, sharp, bookCtrl.modifyBook);

router.delete("/:id",auth, bookCtrl.deleteBook);

router.get("/:id", bookCtrl.getOneBook);

router.get("/", bookCtrl.findAllBooks);

router.post("/:id/rating",auth, bookCtrl.addRatingToBook);

router.post("/:id/bestrating", bookCtrl.getBestRatings);

module.exports = router;
