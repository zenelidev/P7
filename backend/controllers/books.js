const Book = require("../models/Book");
const fs = require("fs");
exports.createBook = (req, res, next) => {
	const bookObject = JSON.parse(req.body.book);
	console.log(bookObject)
	delete bookObject._id;
	delete bookObject._userId;
	
	// if (!bookObject.ratings || bookObject.ratings.length === 0) {
	// 	// If no ratings are provided, create an initial rating with 0
	// 	bookObject.ratings = [{
	// 		userId: req.auth.userId,
	// 		rating: 0
	// 	}];
	// }

	const book = new Book({
		...bookObject,
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
	});

	book
		.save()
		.then(() => res.status(201).json({ message: "Objet enregistré" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
	const bookId = req.params.id;
	let oldImageUrl;
	Book.findOne({ _id: bookId })
		.then((book) => {
			if (!book) {
				return res.status(404).json({ message: "Livre non trouvé" });
			}
			oldImageUrl = book.imageUrl;
			const bookObject = req.file
				? {
						...JSON.parse(req.body.book),
						imageUrl: `${req.protocol}://${req.get("host")}/images/${
							req.file.filename
						}`,
				  }
				: { ...req.body };
			delete bookObject._userId;
			if (book.userId != req.auth.userId) {
				return res.status(401).json({ message: "Non autorisé" });
			}
			return Book.updateOne({ _id: bookId }, { ...bookObject, _id: bookId });
		})
		.then(() => {
			if (req.file && oldImageUrl) {
				const oldImagePath = oldImageUrl.replace(
					`${req.protocol}://${req.get("host")}`,
					"."
				);
				fs.unlink(oldImagePath, (err) => {
					if (err) {
						console.error("Error deleting old image:", err);
					}
				});
			}
			res.status(200).json({ message: "Objet modifié !" });
		})
		.catch((error) => {
			res.status(400).json({ error });
		});
};

exports.deleteBook = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (book.userId != req.auth.userId) {
				res.status(401).json({ message: "Non autorisé" });
			} else {
				const filename = book.imageUrl.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					Book.deleteOne({ _id: req.params.id })
						.then(() => {
							res.status(200).json({ message: "Objet supprimé !" });
						})
						.catch((error) => res.status(401).json({ error }));
				});
			}
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
};

exports.getOneBook = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => res.status(200).json(book))
		.catch((error) => res.status(400).json({ error }));
};

exports.findAllBooks = (req, res, next) => {
	Book.find()
		.then((books) => res.status(200).json(books))
		.catch((error) => res.status(400).json({ error }));
};

exports.addRatingToBook = async (req, res, next) => {
    const bookId = req.params.id;
    const { userId, rating } = req.body;

    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        const existingRating = book.ratings.find((existingRating) => existingRating.userId === userId);

        if (existingRating) {
            return res.status(400).json({ error: "User has already rated the book." });
        }

        // if (isNaN(grade) || grade < 1 || grade > 5) { 
        //     return res.status(400).json({ error: "Invalid grade value. Please provide a valid grade between 1 and 5." });
        // }

        const newRating = {
            userId: userId,
            grade: rating, 
        };


        book.ratings.push(newRating);
		
        await book.save();

        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({ error });
    }
};


exports.getBestRatings = (req, res, next) => {
	Book.find()
		.sort({ averageRating: -1 })
		.limit(3)
		.exec()
		.then((books) => {
			res.status(200).json(books);
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
};
